import { Router } from 'express';
import UserRoute from './user/user';
import GigRoute from './gig/gig';

import SwaggerRoute from './swaggerDoc/router';

const router = Router();

new UserRoute(router);
new GigRoute(router);

new SwaggerRoute(router);
export default router;
