import type { UserDetails } from '../types/request/user';
import { UserRepository } from '../db/repositories';
import { ServiceReturnVal } from '../types/common';
import { RespError } from '../lib/wr_response';
import { IUser } from '../db/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import utility from '../lib/utility';
import Base from './base';
import constants from '../common/constants';

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
        const user = {
          username: params.username,
          email: params.email,
          password: params.password,
          country: params.country,
        } as IUser;
        await this.userRepo.create(user);
        returnVal.data = constants.SUCCESS_MESSAGES.REGISTERED;
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_401, constants.ERROR_MESSAGES.USER_ALREADY_EXISTS);
        return returnVal;
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
      return returnVal;
    }
    return returnVal;
  }

  /**
   * Function for login with email and password
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async login(params: UserDetails): Promise<ServiceReturnVal<object>> {
    const returnVal: ServiceReturnVal<object> = {};
    try {
      const user = await this.userRepo.findOne({ email: params.email });
      //If user exists
      if (!utility.isEmpty(user)) {
        const match = await bcrypt.compare(params.password, user.password);
        if (match) {
          const usr = {
            _id: user._id,
            username: user.username,
            email: user.email,
            country: user.country,
          } as IUser;
          user.password = undefined;
          const token = jwt.sign(usr, process.env.JWT!, { expiresIn: '24h' });
          returnVal.data = { user, token: token };
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_401, constants.ERROR_MESSAGES.INVALID_PASSWORD);
          return returnVal;
        }
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.USER_NOT_FOUND);
        return returnVal;
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
      return returnVal;
    }
    return returnVal;
  }
}
