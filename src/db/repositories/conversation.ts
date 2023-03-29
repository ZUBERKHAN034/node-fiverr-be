import conversationSchemaModel from '../models/conversation';
import type { IConversation } from '../models/conversation';
import { BaseRepository } from './base';
import { TokenUser } from '../../types/request/base';

export default class ConversationRepository extends BaseRepository<IConversation> {
  constructor() {
    super(conversationSchemaModel);
  }

  async findConversations<IConversation>(params: TokenUser): Promise<Array<IConversation>> {
    const pipeline = [];

    // Match stage to filter documents
    const match = params.isSeller
      ? { sellerId: this.toObjectId(params._id) }
      : { buyerId: this.toObjectId(params._id) };

    pipeline.push({ $match: match });

    // Lookup stage to fetch user details and combine with order object
    const lookup = {
      $lookup: {
        from: 'users',
        localField: params.isSeller ? 'buyerId' : 'sellerId',
        foreignField: '_id',
        as: 'userDetails',
      },
    };

    pipeline.push(lookup);

    // Project stage to exclude fields and combine the userDetails object with order object
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
    sort['updatedAt'] = -1;

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

    return results as IConversation[];
  }
}
