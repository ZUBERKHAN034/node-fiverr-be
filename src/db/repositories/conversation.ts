import conversationSchemaModel from '../models/conversation';
import type { IConversation } from '../models/conversation';
import { BaseRepository } from './base';

export default class ConversationRepository extends BaseRepository<IConversation> {
  constructor() {
    super(conversationSchemaModel);
  }
}
