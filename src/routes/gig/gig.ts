import { Router } from 'express';
import GigController from '../../controllers/gig';

export default class GigRoute {
  public router: Router;
  public controller = new GigController();

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }

  routes() {
    this.router.post('/gig', this.controller.create.bind(this.controller));
    this.router.delete('/gig/:id', this.controller.delete.bind(this.controller));
    this.router.get('/services/gig/:id', this.controller.gig.bind(this.controller));
    this.router.post('/services/gigs', this.controller.gigs.bind(this.controller));
    this.router.get('/my-gigs', this.controller.myGigs.bind(this.controller));
  }
}
