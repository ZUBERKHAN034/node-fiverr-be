import { Response } from 'express';
import { ReviewDetails } from '../types/request/review';
import { ParamsID } from '../types/request/base';
import { RespError, WRResponse } from '../lib/wr_response';
import ReviewService from '../services/review';
import Review from '../validations/review/review';
import WRRequest from '../lib/wr_request';

export default class ReviewController {
  private service = new ReviewService();
  private resp = new WRResponse();

  public async create(request: WRRequest<undefined, ReviewDetails, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new Review().getCreateVS();
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
    const valSchema = new Review().getIdVS();
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.delete(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async reviews(request: WRRequest<undefined, undefined, ParamsID>, response: Response) {
    const params = request.params;
    const valSchema = new Review().getIdVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.reviews(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }
}
