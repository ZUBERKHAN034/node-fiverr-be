import { NextFunction, Request, Response, Router } from 'express';
import OrderController from '../../controllers/order';

export default class OrderRoute {
  public router: Router;
  public controller = new OrderController();

  private async fetchSignature(request: Request, _response: Response, next: NextFunction) {
    request.params.signature = request.headers['stripe-signature'] as string;
    return next();
  }

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }

  routes() {
    this.router.post('/order/checkout', this.controller.checkout.bind(this.controller));
    this.router.get('/orders', this.controller.orders.bind(this.controller));
    this.router.post(
      '/services/webhook',
      this.fetchSignature.bind(this.controller),
      this.controller.eventsByWebhook.bind(this.controller)
    );
  }
}
