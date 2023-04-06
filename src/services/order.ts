import { TokenUser } from '../types/request/base';
import { OrderDetails, StripeSignature } from '../types/request/order';
import { GigRepository, OrderRepository } from '../db/repositories';
import { RequestParams, ServiceReturnVal } from '../types/common';
import { RespError } from '../lib/wr_response';
import { IOrder } from '../db/models/order';
import { IGig } from '../db/models/gig';
import Base from './base';
import utility from '../lib/utility';
import constants from '../common/constants';
import stripe from '../lib/stripe_helper';
export default class OrderService extends Base {
  private orderRepo = new OrderRepository();

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

  /**
   * Function for creating order by user
   *
   * @param {OrderDetails}
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async checkout(params: OrderDetails, user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const gigRepo = new GigRepository();
      // If user is a seller then not allowed to create order
      if (user.isSeller === false) {
        const gig: IGig = await gigRepo.findById(params.gigId);

        if (!utility.isEmpty(gig)) {
          await this.orderRepo.removeUncompletedOrders(user);

          const orderParams = {
            gigId: gig._id,
            img: gig.cover,
            title: gig.title,
            buyerId: this.orderRepo.toObjectId(user._id),
            sellerId: gig.userId,
            price: gig.price,
          } as IOrder;

          const order = await this.orderRepo.create(orderParams);
          const checkoutParams = {
            productId: gig._id.toString(),
            productName: gig.shortTitle,
            productDescription: gig.shortDesc,
            productImage: gig.cover,
            email: user.email,
            price: gig.price,
          };

          const metadata = { orderId: order._id.toString() };
          const url = await stripe.createCheckoutSession('payment', checkoutParams, metadata);
          returnVal.data = url;
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
   * Function to listen stripe webhook events
   *
   * @param {PlanDetails}
   * @returns {ServiceReturnVal}
   */
  public async eventsByWebhook(
    params: RequestParams,
    paramsStripe: StripeSignature
  ): Promise<ServiceReturnVal<Object>> {
    const returnVal: ServiceReturnVal<Object> = {};
    try {
      const signature = paramsStripe.signature;
      const event = await stripe.createWebhook(params, signature);
      switch (event.type) {
        case 'checkout.session.completed': {
          if (event.data.mode === 'payment' && event.data.payment_status === 'paid') {
            const orderId = event.data.metadata.orderId;
            const order = await this.orderRepo.findById(orderId);
            order.isCompleted = true;
            await order.save();
          }
          break;
        }
        default: {
          // eslint-disable-next-line no-console
          console.log(`Unhandled event type ${event.type}`);
          break;
        }
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
}
