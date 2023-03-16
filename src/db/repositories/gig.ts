import gigSchemaModel from '../models/gig';
import type { IGig } from '../models/gig';
import { BaseRepository } from './base';
import { SearchParams } from '../../types/request/gig';

export default class GigRepository extends BaseRepository<IGig> {
  constructor() {
    super(gigSchemaModel);
  }

  async findGig<IGig>(_id: string, userId: string): Promise<IGig | null> {
    return (await this._model.findOne({ _id: _id, userId: userId }).select({ _id: true })) as IGig;
  }

  async findGigs<IGig>(params: SearchParams): Promise<Array<IGig>> {
    const filters = {};

    if (params.userId) filters['userId'] = params.userId;

    if (params.cat) filters['cat'] = params.cat;

    if (params.search) filters['title'] = { $regex: params.search, $options: 'i' };

    if (params.min && params.max) filters['price'] = { $gte: params.min, $lte: params.max };

    if (params.min && !params.max) filters['price'] = { $gte: params.min };

    if (!params.min && params.max) filters['price'] = { $lte: params.max };

    const sorting = params.sort === 'desc' ? -1 : 1;

    return (await this._model.find(filters, { __v: false }, { sort: { createdAt: sorting } })) as IGig[];
  }
}
