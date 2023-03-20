import reviewSchemaModel from '../models/review';
import type { IReview } from '../models/review';
import { BaseRepository } from './base';
import { ParamsID } from '../../types/request/base';

export default class ReviewRepository extends BaseRepository<IReview> {
  constructor() {
    super(reviewSchemaModel);
  }

  async findReview<IReview>(gigId: string, userId: string): Promise<IReview | null> {
    return (await this._model.findOne({ gigId: gigId, userId: userId }).select({ _id: true })) as IReview;
  }

  async findReviewWithUser<IReview>(_id: string, userId: string): Promise<IReview | null> {
    return (await this._model.findOne({ _id: _id, userId: userId }).select({ _id: true })) as IReview;
  }

  async findReviewsByGigId<IReview>(params: ParamsID): Promise<Array<IReview>> {
    const pipeline = [];

    // Match stage to filter documents
    const match = { gigId: this.toObjectId(params.id) };

    pipeline.push({ $match: match });

    // Lookup stage to fetch user details and combine with review object
    const lookup = {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userDetails',
      },
    };

    pipeline.push(lookup);

    // Project stage to exclude fields and combine the userDetails object with review object
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

    return results as IReview[];
  }
}
