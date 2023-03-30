import { ParamsID, TokenUser } from '../types/request/base';
import { MessageDetails } from '../types/request/message';
import { ConversationRepository, MessageRepository } from '../db/repositories';
import { ServiceReturnVal } from '../types/common';
import { RespError } from '../lib/wr_response';
import { IMessage } from '../db/models/message';
import { IConversation } from '../db/models/conversation';
import Base from './base';
import constants from '../common/constants';

export default class MessageService extends Base {
  private messageRepo = new MessageRepository();

  /**
   * Function for creating message by user
   *
   * @param {MessageDetails}
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async create(params: MessageDetails, user: TokenUser): Promise<ServiceReturnVal<IMessage>> {
    const returnVal: ServiceReturnVal<IMessage> = {};
    try {
      const conversationRepo = new ConversationRepository();

      const messageParams = {
        conversationId: this.messageRepo.toObjectId(params.conversationId),
        userId: this.messageRepo.toObjectId(user._id),
        desc: params.desc,
      } as IMessage;

      const id = conversationRepo.toObjectId(params.conversationId);
      const conversationParams = {
        readBySeller: user.isSeller,
        readByBuyer: !user.isSeller,
        lastMessage: params.desc,
      } as IConversation;
      await conversationRepo.update(id, conversationParams);

      const message = await this.messageRepo.create(messageParams);
      returnVal.data = message;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for getting messages with conversationId
   *
   * @param {ParamsID}
   * @returns {ServiceReturnVal}
   */
  public async messages(params: ParamsID): Promise<ServiceReturnVal<Array<IMessage>>> {
    const returnVal: ServiceReturnVal<Array<IMessage>> = {};
    try {
      const messages: IMessage[] = await this.messageRepo.findMessages(params);
      returnVal.data = messages;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
}
