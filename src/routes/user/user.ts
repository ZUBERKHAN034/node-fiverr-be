import { Router } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import s3Helper from '../../lib/s3_helper';
import constants from '../../common/constants';
import UserController from '../../controllers/user';
import path from 'path';

export default class UserRoute {
  public router: Router;
  public controller = new UserController();

  private upload = multer({
    storage: multerS3({
      s3: s3Helper.s3Client(),
      bucket: constants.AWS.BUCKET_TYPE.PUBLIC,
      acl: constants.AWS.ACL_TYPE.PUBLIC,
      key: (_request, file, cb) => {
        const fileName = `${constants.AWS.ASSET_FOLDER.PUBLIC.USER}/${file.fieldname}-${Date.now()}${path.extname(
          file.originalname
        )}`;
        cb(null, fileName);
      },
    }),
  });

  constructor(router: Router) {
    this.router = router;
    this.routes();
  }

  routes() {
    this.router.post('/services/register', this.controller.register.bind(this.controller));
    this.router.post('/services/login', this.controller.login.bind(this.controller));
    this.router.post(
      '/services/upload',
      this.upload.fields([{ name: 'assets', maxCount: 1 }]),
      this.controller.upload.bind(this.controller)
    );
    this.router.delete('/user', this.controller.delete.bind(this.controller));
    this.router.post('/user/logout', this.controller.logout.bind(this.controller));
  }
}
