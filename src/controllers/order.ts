import { Response } from 'express';
import { OrderDetails } from '../types/request/order';
// import { ParamsID } from '../types/request/base';
import { RespError, WRResponse } from '../lib/wr_response';
import OrderService from '../services/order';
import Order from '../validations/order/order';
import WRRequest from '../lib/wr_request';

export default class OrderController {
  private service = new OrderService();
  private resp = new WRResponse();

  public async create(request: WRRequest<undefined, OrderDetails, undefined>, response: Response) {
    const params = request.body;
    const valSchema = new Order().getCreateVS();
    const result = valSchema.validate(params);
    const currentUser = request.currentUser;
    if (result.error == null) {
      const resp = await this.service.create(params, currentUser);
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
}
