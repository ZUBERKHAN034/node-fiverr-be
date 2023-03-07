import gigSchemaModel from '../models/gig';
import type { IGig } from '../models/gig';
import { BaseRepository } from './base';

export default class GigRepository extends BaseRepository<IGig> {
  constructor() {
    super(gigSchemaModel);
  }
}
