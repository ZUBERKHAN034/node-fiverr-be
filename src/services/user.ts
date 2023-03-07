import type { CreateUser, Login } from '../types/request/user';
import { UserRepository } from '../db/repositories';
import { ServiceReturnVal } from '../types/common';
import { RespError } from '../lib/wr_response';
import { IUser } from '../db/models/mongoose/user';
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
   * @param {CreateUser}
   * @returns {ServiceReturnVal}
   */
  public async registration(params: CreateUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const user = await this.userRepo.userByEmail(params.email);
      if (utility.isEmpty(user)) {
        const user = {
          firstName: params.firstName,
          lastName: params.lastName,
          fullName: `${params.firstName} ${params.lastName}`,
          email: params.email,
          password: params.password,
        };
        await this.userRepo.create(user as IUser);
        returnVal.data = constants.SUCCESS_MESSAGES.REGISTERED;
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_401, constants.ERROR_MESSAGES.USER_ALREAD_EXISTS);
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
   * @param {Login}
   * @returns {ServiceReturnVal}
   */
  public async login(params: Login): Promise<ServiceReturnVal<object>> {
    const returnVal: ServiceReturnVal<object> = {};
    try {
      const user = await this.userRepo.findOne({ email: params.email });
      //If user exists
      if (!utility.isEmpty(user)) {
        const match = await bcrypt.compare(params.password, user.password);
        if (match) {
          const usr = {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
          };
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
