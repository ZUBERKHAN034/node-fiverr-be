import * as mongoose from 'mongoose';

interface IRead<T> {
  findById: (id: string) => Promise<T | null>;
  findOne(cond?: Object): Promise<mongoose.Query<T | null, T>>;
  find(cond: Object, fields: Object, options: Object): Promise<mongoose.Query<Array<T> | null, T>>;
}

interface IWrite<T> {
  create: (item: T) => Promise<T>;
  update: (_id: mongoose.Types.ObjectId, item: T) => Promise<T | null>;
  delete: (_id: string) => void;
}

export class BaseRepository<T extends mongoose.Document> implements IRead<T>, IWrite<T> {
  protected _model: mongoose.Model<mongoose.Document>;

  constructor(schemaModel: mongoose.Model<mongoose.Document>) {
    this._model = schemaModel;
  }

  async create(item: T): Promise<T> {
    return (await this._model.create(item)) as T;
  }

  async update(_id: mongoose.Types.ObjectId, item: T): Promise<T | null> {
    return await this._model.findOneAndUpdate({ _id: _id }, item, {
      new: true,
    });
  }

  async sofDelete(_id: string) {
    return await this._model.findOneAndUpdate(
      { _id: _id },
      { deleted: true },
      {
        new: true,
      }
    );
  }

  async delete(_id: string) {
    await this._model.remove({ _id: this.toObjectId(_id) });
  }

  async findById(_id: string): Promise<T | null> {
    return await this._model.findById(_id);
  }

  async findOne(cond?: Object): Promise<mongoose.Query<T | null, T>> {
    return await this._model.findOne(cond);
  }

  async find(cond: Object, fields?: Object, options?: Object): Promise<mongoose.Query<Array<T> | null, T>> {
    return await this._model.find(cond, fields, options);
  }

  public toObjectId(_id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(_id);
  }
}
