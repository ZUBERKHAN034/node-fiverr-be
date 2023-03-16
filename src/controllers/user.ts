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
    const params = request.body;
    const valSchema = new User().getRegisterVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.register(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async login(request: WRRequest<undefined, UserDetails, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new User().getLoginVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.login(params);
      if (resp.data?.token) {
        const token = resp.data.token;
        const HTTPS = {
          sameSite: 'none',
          httpOnly: true,
          secure: true,
        };
        const HTTP = {
          httpOnly: true,
        };
        const cookieParams = process.env.FE_BASE_URL ? HTTPS : HTTP;
        response.cookie(constants.ENUMS.TOKENS.ACCESS_TOKEN, token, cookieParams);
      }
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
