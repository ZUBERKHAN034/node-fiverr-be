import { Response } from 'express';
import { OrderDetails, StripeSignature } from '../types/request/order';
import { RequestParams } from '../types/common';
import { RespError, WRResponse } from '../lib/wr_response';
import OrderService from '../services/order';
import Order from '../validations/order/order';
import WRRequest from '../lib/wr_request';

export default class OrderController {
  private service = new OrderService();
  private resp = new WRResponse();

  public async checkout(request: WRRequest<undefined, OrderDetails, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new Order().getCreateVS();
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.checkout(params, currentUser);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async orders(request: WRRequest<undefined, undefined, undefined>, response: Response) {
    const currentUser = request.currentUser;
    const resp = await this.service.orders(currentUser);
    this.resp.resp(response).send(resp);
  }

  public async eventsByWebhook(request: WRRequest<undefined, RequestParams, StripeSignature>, response: Response) {
    const params = request.body;
    const paramsStripe = request.params;
    const resp = await this.service.eventsByWebhook(params, paramsStripe);
    this.resp.resp(response).send(resp);
  }
}
