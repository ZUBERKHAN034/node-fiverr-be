import userSchemaModel from '../models/user';
import type { IUser } from '../models/user';
import { BaseRepository } from './base';

export default class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(userSchemaModel);
  }
  async userByEmail<IUser>(email: string): Promise<IUser | null> {
    return (await this._model.findOne({ email: email }).select({ _id: true })) as IUser;
  }

  async updateByEmail<IUser>(email: string, item?: IUser): Promise<IUser | null> {
    return (await this._model.findOneAndUpdate({ email: email }, item, {
      new: true,
    })) as IUser;
  }
}
