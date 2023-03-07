import userSchemaModel from '../models/mongoose/user';
import type { IUser } from '../models/mongoose/user';
import { BaseRepository } from './base';

export default class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(userSchemaModel);
  }
  async userByEmail<IUser>(email: string): Promise<IUser | null> {
    return (await this._model.findOne({ email: email }).select({ _id: true })) as unknown as IUser;
  }

  async updateById<IUser>(_id: string, item: IUser): Promise<IUser | null> {
    return (await this._model.findOneAndUpdate({ _id: _id }, item, {
      new: true,
    })) as IUser;
  }
  async fetchUsers(cond: Object, fields?: Object, options?: Object, page?: number, limit?: number, sort?: any) {
    return await this._model
      .find(cond, fields, options)
      .select({
        firstName: 1,
        lastName: 1,
        fullName: 1,
        email: 1,
        lastActivity: 1,
        isArchived: 1,
        plan: 1,
        status: 1,
      })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);
  }
  async countDocuments(type) {
    return await this._model.countDocuments(type);
  }
  async updateByEmail<IUser>(email: string, item?: IUser): Promise<IUser | null> {
    return (await this._model.findOneAndUpdate({ email: email }, item, {
      new: true,
    })) as IUser;
  }
  async fetchUser<IUser>(cond: Object): Promise<IUser | null> {
    return (await this._model.findOne(cond).select({ password: 0 })) as unknown as IUser;
  }

  async fetchUsersReport<IUsers>(fields?: string, page?: number, limit?: number, sort?: any): Promise<IUsers | null> {
    const match = {
      downloads: { $gt: 0 },
      $or: [
        { fullName: { $regex: fields, $options: 'i' } },
        { email: { $regex: fields, $options: 'i' } },
        { plan: { $regex: fields, $options: 'i' } },
      ],
    };
    return (await this._model.aggregate([
      {
        $lookup: {
          from: 'bills',
          localField: '_id',
          foreignField: 'userId',
          as: 'billDetails',
        },
      },
      {
        $match: match,
      },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          fullName: 1,
          email: 1,
          plan: 1,
          downloads: 1,
          recentDownloadDate: 1,
          billDetails: {
            city: 1,
            state: 1,
            country: 1,
          },
        },
      },
      { $limit: limit },
      { $skip: (page - 1) * limit },
      { $sort: sort },
    ])) as unknown as IUsers;
  }
}
