import UserService from '../services/user';
import User from '../validations/user/user';
import WRRequest from '../lib/wr_request';
import { Response } from 'express';
import { CreateUser, Login } from '../types/request/user';
import { RespError, WRResponse } from '../lib/wr_response';

export default class UserController {
  private service = new UserService();
  private resp = new WRResponse();

  public async registration(request: WRRequest<CreateUser, undefined>, response: Response) {
    const valSchema = new User().getCreateUserVS(false);
    const result = valSchema.validate(request.body);
    if (result.error == null) {
      const resp = await this.service.registration(request.body);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async login(request: WRRequest<Login, undefined>, response: Response) {
    const valSchema = new User().getLoginVS();
    const result = valSchema.validate(request.body);
    if (result.error == null) {
      const resp = await this.service.login(request.body);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }
}
