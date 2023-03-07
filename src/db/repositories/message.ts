import messageSchemaModel from '../models/message';
import type { IMessage } from '../models/message';
import { BaseRepository } from './base';

export default class MessageRepository extends BaseRepository<IMessage> {
  constructor() {
    super(messageSchemaModel);
  }
}
