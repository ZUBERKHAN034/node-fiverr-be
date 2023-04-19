import dotenv from 'dotenv';

if (['local', 'nodemon-local'].includes(process.env.NODE_ENV?.trim())) {
  let path = `${__dirname}/../../.env.local`;
  if (process.env.NODE_ENV === 'nodemon-local') path = `${__dirname}/../.env.local`;
  dotenv.config({ path: path });
}

import express from 'express';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes';
import constants from './common/constants';
import { expressjwt } from 'express-jwt';
import { DBManager } from './db/db_manager';

export class ApiServer {
  public app: express.Application;
  private PORT;
  private corsOptions = () => {
    return cors({ origin: constants.ENUMS.FE_BASE_URL, credentials: true });
  };

  // private resp = new TPCResponse();

  constructor() {
    this.PORT = process.env.PORT || 8002;
    this.app = express();
    this.configureJWT();
    this.config();
    this.routes();

    // DB connection
    DBManager.connect({
      db: process.env.DB,
      url: process.env.DB_URL,
      debug: process.env.DB_DEBUG == 'true' ? true : false,
    });
  }

  public config() {
    this.app.use('/services/webhook', express.raw({ type: '*/*' }));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(compression());
    this.app.use(this.corsOptions());
    this.app.use(express.json({ limit: '30mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '30mb' }));
    this.app.use(express.static('public'));
  }

  public configureJWT() {
    const publicRoutes = [/\/media\/*/, /\/services\/*/, /\/api-doc\/*/];
    this.app.use(
      expressjwt({
        secret: process.env.JWT!,
        algorithms: ['HS256'],
        requestProperty: 'currentUser',
        getToken: (req) => req.headers.cookie?.split('accessToken=')[1] || null,
      }).unless({ path: publicRoutes })
    );
  }

  public routes() {
    this.app.use('/', router);
    // const errorHandler: ErrorRequestHandler = (error, _request, response) => {
    //   response.header('Access-Control-Allow-Origin', '*');
    //   const statusCode = utility.isEmpty(error.status) ? constants.RESP_ERR_CODES.ERR_500 : error.status;
    //   this.resp.resp(response).error(new RespError(statusCode, error.message));
    // };
    // this.app.use(errorHandler);
  }

  public start() {
    this.app.listen(this.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API server started at http://localhost:${this.PORT}`);
    });
  }
}

const apiServer = new ApiServer();
apiServer.start();
