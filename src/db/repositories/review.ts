import reviewSchemaModel from '../models/review';
import type { IReview } from '../models/review';
import { BaseRepository } from './base';

export default class ReviewRepository extends BaseRepository<IReview> {
  constructor() {
    super(reviewSchemaModel);
  }
}
