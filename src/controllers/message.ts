import { Response } from 'express';
import { MessageDetails } from '../types/request/message';
import { RespError, WRResponse } from '../lib/wr_response';
import MessageService from '../services/message';
import Message from '../validations/message/message';
import WRRequest from '../lib/wr_request';
import { ParamsID } from '../types/request/base';

export default class MessageController {
  private service = new MessageService();
  private resp = new WRResponse();

  public async create(request: WRRequest<undefined, MessageDetails, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new Message().getCreateVS();
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.create(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }
  public async messages(request: WRRequest<undefined, undefined, ParamsID>, response: Response) {
    const params = request.params;
    const valSchema = new Message().getIdVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.messages(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }
}
