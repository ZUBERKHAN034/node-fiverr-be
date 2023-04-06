import { Router } from 'express';
import ReviewController from '../../controllers/review';

export default class ReviewRoute {
  public router: Router;
  public controller = new ReviewController();

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }

  routes() {
    this.router.post('/review', this.controller.create.bind(this.controller));
    this.router.post('/review/:id', this.controller.delete.bind(this.controller));
    this.router.get('/services/reviews/:id', this.controller.reviews.bind(this.controller));
  }
}
