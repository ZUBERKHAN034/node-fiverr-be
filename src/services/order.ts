import { TokenUser } from '../types/request/base';
import { OrderDetails } from '../types/request/order';
import { GigRepository, OrderRepository } from '../db/repositories';
import { ServiceReturnVal } from '../types/common';
import { RespError } from '../lib/wr_response';
import { IOrder } from '../db/models/order';
import { IGig } from '../db/models/gig';
import Base from './base';
import utility from '../lib/utility';
import constants from '../common/constants';

export default class OrderService extends Base {
  private orderRepo = new OrderRepository();

  /**
   * Function for creating order by user
   *
   * @param {OrderDetails}
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async create(params: OrderDetails, user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const gigRepo = new GigRepository();
      // If user is a seller then not allowed to create order
      if (user.isSeller === false) {
        const gig: IGig = await gigRepo.findById(params.gigId);
        if (!utility.isEmpty(gig)) {
          const order = {
            gigId: gig._id,
            img: gig.cover,
            title: gig.title,
            buyerId: this.orderRepo.toObjectId(user._id),
            sellerId: gig.userId,
            price: gig.price,
            paymentIntent: 'paymentIntentDemo',
          } as IOrder;
          await this.orderRepo.create(order);
          returnVal.data = constants.SUCCESS_MESSAGES.OK;
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.GIG_NOT_FOUND);
        }
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_403, constants.ERROR_MESSAGES.NOT_AUTHORIZED);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for getting orders with userId
   *
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async orders(user: TokenUser): Promise<ServiceReturnVal<Array<IOrder>>> {
    const returnVal: ServiceReturnVal<Array<IOrder>> = {};
    try {
      const orders: IOrder[] = await this.orderRepo.findOrders(user);
      returnVal.data = orders;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
}
