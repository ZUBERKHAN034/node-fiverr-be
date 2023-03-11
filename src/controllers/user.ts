import { Response } from 'express';
import { UserDetails } from '../types/request/user';
import { RespError, WRResponse } from '../lib/wr_response';
import { UploadFile } from '../types/request/base';
import UserService from '../services/user';
import User from '../validations/user/user';
import WRRequest from '../lib/wr_request';
import constants from '../common/constants';

export default class UserController {
  private service = new UserService();
  private resp = new WRResponse();

  public async register(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const valSchema = new User().getRegisterVS();
    const result = valSchema.validate(request.body);
    if (result.error == null) {
      const resp = await this.service.register(request.body);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async login(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const valSchema = new User().getLoginVS();
    const result = valSchema.validate(request.body);
    if (result.error == null) {
      const resp = await this.service.login(request.body);
      resp.data?.token &&
        response.cookie(constants.ENUMS.TOKENS.ACCESS_TOKEN, resp.data.token, { httpOnly: true, secure: true });
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async delete(request: WRRequest<undefined, undefined, undefined>, response: Response) {
    const currentUser = request.currentUser;
    const resp = await this.service.delete(currentUser);
    this.resp.resp(response).send(resp);
  }

  public async logout(request: WRRequest<undefined, undefined, undefined>, response: Response) {
    const currentUser = request.currentUser;
    const resp = await this.service.logout(currentUser);
    if (resp.data == constants.SUCCESS_MESSAGES.OK) {
      response.clearCookie(constants.ENUMS.TOKENS.ACCESS_TOKEN, { sameSite: 'none', secure: true });
    }
    this.resp.resp(response).send(resp);
  }
  public async upload(request: WRRequest<undefined, UploadFile, undefined>, response: Response) {
    const params = request.body;
    params.files = request.files;
    const resp = await this.service.upload(params);
    this.resp.resp(response).send(resp);
  }
}
