import { Router } from 'express';
import { apiDocumentation } from './swagger';
import swaggerUi from 'swagger-ui-express';

export default class UserRoute {
  public router: Router;

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }

  routes() {
    this.router.use('/api-doc', swaggerUi.serve, swaggerUi.setup(apiDocumentation));
  }
}
