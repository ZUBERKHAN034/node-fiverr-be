import { Router } from 'express';
import ConversationController from '../../controllers/conversation';

export default class ConversationRoute {
  public router: Router;
  public controller = new ConversationController();

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }

  routes() {
    this.router.post('/conversation', this.controller.create.bind(this.controller));
    this.router.get('/conversations', this.controller.conversations.bind(this.controller));
    this.router.get('/conversation/:sellerId/:buyerId', this.controller.conversation.bind(this.controller));
    this.router.post('/conversation-read', this.controller.update.bind(this.controller));
    this.router.get('/conversation-receiver/:id', this.controller.receiver.bind(this.controller));
  }
}
