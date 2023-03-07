import { Router } from 'express';
import UserRoute from './user/user';

import SwaggerRoute from './swaggerDoc/router';

const router = Router();

new UserRoute(router);

new SwaggerRoute(router);
export default router;
