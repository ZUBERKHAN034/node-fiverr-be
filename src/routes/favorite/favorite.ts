import { Router } from 'express';
import FavoriteController from '../../controllers/favorite';

export default class OrderRoute {
  public router: Router;
  public controller = new FavoriteController();

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }

  routes() {
    this.router.post('/favorite', this.controller.create.bind(this.controller));
    this.router.delete('/favorite/:id', this.controller.delete.bind(this.controller));
    this.router.get('/favorites', this.controller.favorites.bind(this.controller));
  }
}
