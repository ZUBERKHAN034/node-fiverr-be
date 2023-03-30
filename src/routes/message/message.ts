import { Router } from 'express';
import MessageController from '../../controllers/message';

export default class MessageRoute {
  public router: Router;
  public controller = new MessageController();

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }

  routes() {
    this.router.post('/message', this.controller.create.bind(this.controller));
    this.router.get('/messages/:id', this.controller.messages.bind(this.controller));
  }
}
