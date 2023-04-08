import type { UserDetails } from '../types/request/user';
import { ParamsID, TokenUser, UploadFile } from '../types/request/base';
import { UserRepository } from '../db/repositories';
import { ServiceReturnVal } from '../types/common';
import { RespError } from '../lib/wr_response';
import { IUser } from '../db/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import utility from '../lib/utility';
import Base from './base';
import constants from '../common/constants';
import appFunctions from '../lib/app_functions';

export default class UserService extends Base {
  private userRepo = new UserRepository();

  /**
   * Function for registration of users
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async register(params: UserDetails): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const isUser = await this.userRepo.userByEmail(params.email);
      if (utility.isEmpty(isUser)) {
        const usr = {
          username: params.username,
          email: params.email,
          password: params.password,
          country: params.country,
          img: params.img == undefined ? await appFunctions.generateAvatars(params.username) : params.img,
          desc: params.desc,
          phone: params.phone,
          isSeller: params.isSeller == 'true' ? true : false,
        } as IUser;
        await this.userRepo.create(usr);
        returnVal.data = constants.SUCCESS_MESSAGES.REGISTERED;
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_409, constants.ERROR_MESSAGES.USER_ALREADY_EXISTS);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for login with email and password
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async login(params: UserDetails): Promise<ServiceReturnVal<any>> {
    const returnVal: ServiceReturnVal<any> = {};
    try {
      const usernameOrEmail = params.username.toLowerCase();
      const user = await this.userRepo.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });
      // If user exists
      if (!utility.isEmpty(user)) {
        const match = await bcrypt.compare(params.password, user.password);
        if (match) {
          const usr = {
            _id: user._id,
            username: user.username,
            email: user.email,
            country: user.country,
            isSeller: user.isSeller,
          } as IUser;
          user.password = undefined;
          const token = jwt.sign(usr, process.env.JWT!);
          returnVal.data = { user, token: token };
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_401, constants.ERROR_MESSAGES.INVALID_PASSWORD);
        }
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for deleting user account
   *
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async delete(user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const usr = await this.userRepo.findById(user._id);
      // If user exists
      if (!utility.isEmpty(usr)) {
        await this.userRepo.delete(usr._id);
        returnVal.data = constants.SUCCESS_MESSAGES.OK;
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for logout user
   *
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async logout(user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const usr = await this.userRepo.findById(user._id);
      // If user exists
      if (!utility.isEmpty(usr)) {
        returnVal.data = constants.SUCCESS_MESSAGES.OK;
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function to upload files
   *
   * @param {UploadFile}
   * @returns {ServiceReturnVal}
   */
  public async upload(params: UploadFile): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      if (!utility.isEmpty(params.files) && !utility.isEmpty(params.files['assets'])) {
        const image = params.files['assets'][0];
        const url = image['location'];
        returnVal.data = url;
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.FILE_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for getting user account
   *
   * @param {ParamsID}
   * @returns {ServiceReturnVal}
   */
  public async get(params: ParamsID): Promise<ServiceReturnVal<IUser>> {
    const returnVal: ServiceReturnVal<IUser> = {};
    try {
      const user: IUser = await this.userRepo.findById(params.id);
      // If user exists
      if (!utility.isEmpty(user)) {
        user.password = undefined;
        returnVal.data = user;
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
}
