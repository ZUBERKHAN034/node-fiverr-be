import type { SetupAcctProfile, UserDetails, VerifyHash } from '../types/request/user';
import { ParamsID, TokenUser, UploadFile } from '../types/request/base';
import { CodeRepository, UserRepository } from '../db/repositories';
import { ServiceReturnVal } from '../types/common';
import { RespError } from '../lib/wr_response';
import { IUser } from '../db/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import utility from '../lib/utility';
import constants from '../common/constants';
import appFunctions from '../lib/app_functions';
import stripe from '../lib/stripe_helper';
import moment from 'moment';
import Base from './base';
import Emailer from '../common/emailer';

export default class UserService extends Base {
  private userRepo = new UserRepository();
  private emailer = new Emailer(process.env.SEND_IN_BLUE_API_KEY, {
    name: constants.SEND_IN_BLUE.SENDER_NAME,
    email: constants.SEND_IN_BLUE.SENDER_EMAIL,
  });

  /**
   * Function for registration of users
   *
   * @param {UserDetails}
   * @returns {ServiceReturnVal}
   */
  public async register(params: UserDetails): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const codeRepo = new CodeRepository();
      const isUser = await this.userRepo.userByEmail(params.email);

      if (utility.isEmpty(isUser)) {
        const userParams = {
          username: params.username.toLowerCase(),
          email: params.email.toLowerCase(),
          password: params.password,
          country: params.country,
          img: await appFunctions.generateAvatars(params.username, params.gender),
          isSeller: params.isSeller == 'true' ? true : false,
          gender: params.gender,
        } as IUser;

        const user = await this.userRepo.create(userParams);

        // send mail to verify account
        await codeRepo.deactivateOldCodes(user.email, constants.ENUMS.HASH_TYPES.CREATE_NEW_ACCT);

        const hash = utility.hash(12);
        await codeRepo.add(hash, constants.ENUMS.HASH_TYPES.CREATE_NEW_ACCT, user._id, user.email);

        const varsToReplace = { hash: hash, url: `${constants.ENUMS.FE_BASE_URL}/account-verify/` };
        const verifyEmailHtml = this.emailer.renderEmailTemplate('verify_email', varsToReplace, 'email-templates');
        await this.emailer.sendEmail(
          user.email,
          `Verify Your ${constants.SEND_IN_BLUE.SENDER_NAME} Account`,
          verifyEmailHtml
        );

        returnVal.data = constants.SUCCESS_MESSAGES.VERIFY_EMAIL_SENDED;
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
      const usernameOrEmail = params.username.trim().toLowerCase();
      const user = await this.userRepo.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });

      // If user exists
      if (!utility.isEmpty(user)) {
        const match = await bcrypt.compare(params.password, user.password);

        if (match) {
          if (user.verified) {
            const usr = {
              _id: user._id,
              username: user.username,
              email: user.email,
              country: user.country,
              isSeller: user.isSeller,
              customerId: user.customerId,
            } as IUser;
            user.password = undefined;

            const token = jwt.sign(usr, process.env.JWT!);
            returnVal.data = { user, token: token };
          } else {
            returnVal.error = new RespError(
              constants.RESP_ERR_CODES.ERR_401,
              constants.ERROR_MESSAGES.USER_NOT_VERIFIED
            );
          }
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

  /**
   * Function setup user profile
   *
   * @param {SetupAcctProfile}
   * @returns {ServiceReturnVal}
   */
  public async setupAcctProfile(params: SetupAcctProfile, user: TokenUser): Promise<ServiceReturnVal<IUser>> {
    const returnVal: ServiceReturnVal<IUser> = {};
    try {
      const userId = this.userRepo.toObjectId(user._id);

      const setupProfileParams = {
        completed: true,
        phone: params.phone,
        desc: params.desc,
        img: params.img,
      } as IUser;

      // If user is buyer then create new stripe customer
      if (user.isSeller === false) {
        const alreadyExitsCustomerId = await stripe.customerByEmail(user.email);

        if (utility.isEmpty(alreadyExitsCustomerId)) {
          const newCreatedCustomerId = await stripe.createCustomer({
            email: user.email,
            name: user.username,
            description: constants.ENUMS.ROLE.BUYER,
          });

          setupProfileParams.customerId = newCreatedCustomerId;
        } else {
          setupProfileParams.customerId = alreadyExitsCustomerId;
        }
      }

      // Sending Welcome Email on successful verification
      const varsToReplace = { username: user.username };
      const welcomeEmailHtml = this.emailer.renderEmailTemplate('welcome_email', varsToReplace, 'email-templates');

      await this.emailer.sendEmail(user.email, `Welcome to ${constants.SEND_IN_BLUE.SENDER_NAME}`, welcomeEmailHtml);

      const usr = await this.userRepo.update(userId, setupProfileParams);
      usr.password = undefined;
      returnVal.data = usr;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function to verify the link hash code for user verifications.
   *
   * @param {VerifyHash}
   * @returns {ServiceReturnVal}
   */
  public async verifyLink(params: VerifyHash): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      const codeRepo = new CodeRepository();
      const code = await codeRepo.findOne({ code: params.hash });

      if (!utility.isEmpty(code)) {
        const createdTime = moment.utc(code.createdAt);
        const currentTime = moment().utc();

        const diffInTime = currentTime.diff(createdTime, 'minutes');
        const expiresIn =
          code.type === constants.ENUMS.HASH_TYPES.CREATE_NEW_ACCT
            ? constants.ENUMS.HASH_EXPIRES_IN.VERIFY_EXPIRY
            : constants.ENUMS.HASH_EXPIRES_IN.DEFAULT_EXPIRY;

        if (diffInTime <= expiresIn) {
          switch (code.type) {
            case constants.ENUMS.HASH_TYPES.CREATE_NEW_ACCT: {
              const createNewAcctParams = { verified: true } as IUser;

              await this.userRepo.update(code.userId, createNewAcctParams);
              break;
            }

            case constants.ENUMS.HASH_TYPES.RESET_PASSWORD: {
              const resetPasswordParams = { password: await bcrypt.hash(params.password, 10) } as IUser;

              await this.userRepo.update(code.userId, resetPasswordParams);
              break;
            }

            case constants.ENUMS.HASH_TYPES.UPDATE_EMAIL: {
              const updateEmailParams = { email: code.email } as IUser;

              await this.userRepo.update(code.userId, updateEmailParams);
              break;
            }
          }

          returnVal.data = constants.SUCCESS_MESSAGES.OK;
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_410, constants.ERROR_MESSAGES.HASH_EXPIRED);
        }
        // if expired remove hash
        await codeRepo.deactivateCode(params.hash);
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.INVALID_HASH);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
}
