import { Router } from 'express';
import UserRoute from './user/user';
import GigRoute from './gig/gig';
import ReviewRoute from './review/review';
import OrderRoute from './order/order';

import SwaggerRoute from './swaggerDoc/router';

const router = Router();

new UserRoute(router);
new GigRoute(router);
new ReviewRoute(router);
new OrderRoute(router);

new SwaggerRoute(router);
export default router;
