import { Response } from 'express';
import { FavoriteDetails } from '../types/request/favorite';
import { ParamsID } from '../types/request/base';
import { RespError, WRResponse } from '../lib/wr_response';
import FavoriteService from '../services/favorite';
import Favorite from '../validations/favorite/favorite';
import WRRequest from '../lib/wr_request';

export default class FavoriteController {
  private service = new FavoriteService();
  private resp = new WRResponse();

  public async create(request: WRRequest<undefined, FavoriteDetails, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new Favorite().getCreateVS();
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.create(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async delete(request: WRRequest<undefined, undefined, ParamsID>, response: Response) {
    const params = request.params;
    const valSchema = new Favorite().getIdVS();
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.delete(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async favorites(request: WRRequest<undefined, undefined, undefined>, response: Response) {
    const currentUser = request.currentUser;
    const resp = await this.service.favorites(currentUser);
    this.resp.resp(response).send(resp);
  }
}
