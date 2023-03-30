import { ParamsID, TokenUser } from '../types/request/base';
import { ConversationDetails } from '../types/request/conversation';
import { ConversationRepository, UserRepository } from '../db/repositories';
import { ServiceReturnVal } from '../types/common';
import { RespError } from '../lib/wr_response';
import { IConversation } from '../db/models/conversation';
import Base from './base';
import constants from '../common/constants';
import utility from '../lib/utility';
import { IUser } from '../db/models/user';

export default class ConversationService extends Base {
  private conversationRepo = new ConversationRepository();

  /**
   * Function for creating conversation by user
   *
   * @param {ConversationDetails}
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async create(params: ConversationDetails, user: TokenUser): Promise<ServiceReturnVal<IConversation>> {
    const returnVal: ServiceReturnVal<IConversation> = {};
    try {
      const conversation = {
        sellerId: user.isSeller
          ? this.conversationRepo.toObjectId(user._id)
          : this.conversationRepo.toObjectId(params.to),
        buyerId: user.isSeller
          ? this.conversationRepo.toObjectId(params.to)
          : this.conversationRepo.toObjectId(user._id),
        readBySeller: user.isSeller,
        readByBuyer: !user.isSeller,
      } as IConversation;
      returnVal.data = await this.conversationRepo.create(conversation);
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for getting conversations with userId
   *
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async conversations(user: TokenUser): Promise<ServiceReturnVal<Array<IConversation>>> {
    const returnVal: ServiceReturnVal<Array<IConversation>> = {};
    try {
      const conversations: IConversation[] = await this.conversationRepo.findConversations(user);
      returnVal.data = conversations;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for getting conversation updated with conversationId
   * @param {ParamsID}
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async update(params: ParamsID, user: TokenUser): Promise<ServiceReturnVal<IConversation>> {
    const returnVal: ServiceReturnVal<IConversation> = {};
    try {
      const id = this.conversationRepo.toObjectId(params.id);
      const readParams = {
        readBySeller: user.isSeller,
        readByBuyer: !user.isSeller,
      } as IConversation;

      const conversation: IConversation = await this.conversationRepo.update(id, readParams);
      returnVal.data = conversation;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for getting conversation with sellerId & buyerId
   *
   * @param {ConversationDetails}
   * @returns {ServiceReturnVal}
   */
  public async conversation(params: ConversationDetails): Promise<ServiceReturnVal<IConversation>> {
    const returnVal: ServiceReturnVal<IConversation> = {};
    try {
      const query = {
        sellerId: this.conversationRepo.toObjectId(params.sellerId),
        buyerId: this.conversationRepo.toObjectId(params.buyerId),
      } as IConversation;

      const conversation: IConversation = await this.conversationRepo.findOne(query);

      if (!utility.isEmpty(conversation)) {
        returnVal.data = conversation;
      } else {
        returnVal.error = new RespError(
          constants.RESP_ERR_CODES.ERR_404,
          constants.ERROR_MESSAGES.CONVERSATION_NOT_FOUND
        );
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for getting conversation receiver
   * @param {ParamsID}
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async receiver(params: ParamsID, user: TokenUser): Promise<ServiceReturnVal<IUser>> {
    const returnVal: ServiceReturnVal<IUser> = {};
    try {
      const userRepo = new UserRepository();
      const conversation: IConversation = await this.conversationRepo.findById(params.id);
      const query = { _id: user.isSeller ? conversation.buyerId : conversation.sellerId };
      const usr = await userRepo.findOne(query);
      returnVal.data = usr;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
}
