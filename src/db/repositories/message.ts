import messageSchemaModel from '../models/message';
import type { IMessage } from '../models/message';
import { BaseRepository } from './base';
import { ParamsID } from '../../types/request/base';

export default class MessageRepository extends BaseRepository<IMessage> {
  constructor() {
    super(messageSchemaModel);
  }

  async findMessages<IMessage>(params: ParamsID): Promise<Array<IMessage>> {
    const pipeline = [];

    // Match stage to filter documents
    const match = { conversationId: this.toObjectId(params.id) };

    pipeline.push({ $match: match });

    // Lookup stage to fetch user details and combine with message object
    const lookup = {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userDetails',
      },
    };

    pipeline.push(lookup);

    // Project stage to exclude fields and combine the userDetails object with message object
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

    return results as IMessage[];
  }
}
