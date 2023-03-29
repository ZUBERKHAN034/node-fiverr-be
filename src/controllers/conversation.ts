import { Response } from 'express';
import { ConversationDetails } from '../types/request/conversation';
import { RespError, WRResponse } from '../lib/wr_response';
import ConversationService from '../services/conversation';
import Conversation from '../validations/conversation/conversation';
import WRRequest from '../lib/wr_request';
import { ParamsID } from '../types/request/base';

export default class ConversationController {
  private service = new ConversationService();
  private resp = new WRResponse();

  public async create(request: WRRequest<undefined, ConversationDetails, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new Conversation().getCreateVS();
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.create(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async conversations(request: WRRequest<undefined, undefined, undefined>, response: Response) {
    const currentUser = request.currentUser;
    const resp = await this.service.conversations(currentUser);
    this.resp.resp(response).send(resp);
  }

  public async update(request: WRRequest<undefined, ParamsID, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new Conversation().getIdVS();
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.update(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }
}
