import gigSchemaModel from '../models/gig';
import type { IGig } from '../models/gig';
import { BaseRepository } from './base';
import { SearchParams } from '../../types/request/gig';
import { ParamsID } from '../../types/request/base';

export default class GigRepository extends BaseRepository<IGig> {
  constructor() {
    super(gigSchemaModel);
  }

  async findGigWithUser<IGig>(_id: string, userId: string): Promise<IGig | null> {
    return (await this._model.findOne({ _id: _id, userId: userId }).select({ _id: true })) as IGig;
  }

  async findGigs<IGig>(params: SearchParams): Promise<Array<IGig>> {
    const pipeline = [];

    // Match stage to filter documents
    const match = {};
    if (params.userId) match['userId'] = params.userId;
    if (params.cat) match['cat'] = params.cat;
    if (params.search) match['title'] = { $regex: params.search, $options: 'i' };
    if (params.min && params.max) match['price'] = { $gte: parseInt(params.min), $lte: parseInt(params.max) };
    if (params.min && !params.max) match['price'] = { $gte: parseInt(params.min) };
    if (!params.min && params.max) match['price'] = { $lte: parseInt(params.max) };

    pipeline.push({ $match: match });

    // Lookup stage to fetch user details and combine with gig object
    const lookup = {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userDetails',
      },
    };

    pipeline.push(lookup);

    // Project stage to exclude fields and combine the userDetails object with gig object
    const project = {
      $project: {
        __v: 0,
        userDetails: {
          password: 0,
          __v: 0,
          updatedAt: 0,
        },
      },
    };

    pipeline.push(project);

    // Sort stage to sort documents based on the specified field and order
    const sort = {};
    sort[params.orderBy] = -1;

    pipeline.push({ $sort: sort });

    // Unwind stage to flatten the userDetails array
    const unwind = {
      $unwind: {
        path: '$userDetails',
      },
    };

    pipeline.push(unwind);

    // Execute the aggregation pipeline
    const results = await this._model.aggregate(pipeline);

    return results as IGig[];
  }

  async findGig<IGig>(params: ParamsID): Promise<IGig> {
    const pipeline = [];

    // Match stage to filter documents
    const match = { _id: this.toObjectId(params.id) };

    pipeline.push({ $match: match });

    // Lookup stage to fetch user details and combine with gig object
    const lookup = {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userDetails',
      },
    };

    pipeline.push(lookup);

    // Project stage to exclude fields and combine the userDetails object with gig object
    const project = {
      $project: {
        __v: 0,
        userDetails: {
          password: 0,
          __v: 0,
          updatedAt: 0,
        },
      },
    };

    pipeline.push(project);

    // Unwind stage to flatten the userDetails array
    const unwind = {
      $unwind: {
        path: '$userDetails',
      },
    };

    pipeline.push(unwind);

    // Execute the aggregation pipeline
    const results = await this._model.aggregate(pipeline);

    return results[0] as IGig;
  }
}
