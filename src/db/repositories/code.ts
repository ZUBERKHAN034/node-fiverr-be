import type { ICode } from '../models/code';
import { BaseRepository } from './base';
import CodeSchema from '../models/code';

export default class CodeRepository extends BaseRepository<ICode> {
  constructor() {
    super(CodeSchema);
  }

  async add<ICode>(hash: string, type: string, userId: string, email: string): Promise<ICode | null> {
    const code = await this._model.create({
      code: hash,
      type: type,
      userId: userId,
      email: email,
    } as ICode);
    return code['_id'];
  }

  async deactivateCode<ICode>(hash: string): Promise<ICode | null> {
    return await this._model.findOneAndDelete({ code: hash } as ICode);
  }

  async deactivateOldCodes<ICode>(email: string, type: string): Promise<ICode | null> {
    return (await this._model.deleteMany({ email, type })) as ICode;
  }
}
