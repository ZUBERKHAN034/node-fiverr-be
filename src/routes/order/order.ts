import { Router } from 'express';
import OrderController from '../../controllers/order';

export default class OrderRoute {
  public router: Router;
  public controller = new OrderController();

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }

  routes() {
    this.router.post('/order', this.controller.create.bind(this.controller));
    this.router.get('/orders', this.controller.orders.bind(this.controller));
  }
}
