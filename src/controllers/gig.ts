import { Response } from 'express';
import { GigDetails, SearchParams } from '../types/request/gig';
import { ParamsID } from '../types/request/base';
import { RespError, WRResponse } from '../lib/wr_response';
import GigService from '../services/gig';
import Gig from '../validations/gig/gig';
import WRRequest from '../lib/wr_request';

export default class GigController {
  private service = new GigService();
  private resp = new WRResponse();

  public async create(request: WRRequest<undefined, GigDetails, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new Gig().getCreateVS();
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
    const valSchema = new Gig().getDeleteVS();
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.delete(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async gig(request: WRRequest<undefined, undefined, ParamsID>, response: Response) {
    const params = request.params;
    const valSchema = new Gig().getDeleteVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.gig(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async gigs(request: WRRequest<SearchParams, undefined, undefined>, response: Response) {
    const params = request.query;
    const valSchema = new Gig().getGigsVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.gigs(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }
}
