import favoriteSchemaModel from '../models/favorite';
import type { IFavorite } from '../models/favorite';
import { BaseRepository } from './base';

export default class FavoriteRepository extends BaseRepository<IFavorite> {
  constructor() {
    super(favoriteSchemaModel);
  }

  async findFavoriteWithUser<IFavorite>(gigId: string, userId: string): Promise<IFavorite | null> {
    return (await this._model.findOne({ gigId: gigId, userId: userId }).select({ _id: true })) as IFavorite;
  }
}
