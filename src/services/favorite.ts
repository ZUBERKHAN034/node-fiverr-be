import { ParamsID, TokenUser } from '../types/request/base';
import { FavoriteDetails } from '../types/request/favorite';
import { FavoriteRepository } from '../db/repositories';
import { ServiceReturnVal } from '../types/common';
import { RespError } from '../lib/wr_response';
import { IFavorite } from '../db/models/favorite';
import Base from './base';
import constants from '../common/constants';
import utility from '../lib/utility';

export default class FavoriteService extends Base {
  private favoriteRepo = new FavoriteRepository();

  /**
   * Function for adding gig into favorite by buyer
   *
   * @param {FavoriteDetails}
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async create(params: FavoriteDetails, user: TokenUser): Promise<ServiceReturnVal<IFavorite>> {
    const returnVal: ServiceReturnVal<IFavorite> = {};
    try {
      // If user is a buyer
      if (user.isSeller === false) {
        const isAdded: IFavorite = await this.favoriteRepo.findFavoriteWithUser(params.gigId, user._id);
        if (utility.isEmpty(isAdded)) {
          const favorite = {
            userId: this.favoriteRepo.toObjectId(user._id),
            gigId: this.favoriteRepo.toObjectId(params.gigId),
            price: parseInt(params.price),
            title: params.title,
            img: params.img,
          } as IFavorite;
          returnVal.data = await this.favoriteRepo.create(favorite);
        } else {
          returnVal.error = new RespError(
            constants.RESP_ERR_CODES.ERR_409,
            constants.ERROR_MESSAGES.FAV_ALREADY_EXISTS
          );
        }
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_403, constants.ERROR_MESSAGES.NOT_AUTHORIZED);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for removing gig from favorite by seller
   *
   * @param {ParamsID}
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async delete(params: ParamsID, user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      // If user is a buyer
      if (user.isSeller === false) {
        const favorite: IFavorite = await this.favoriteRepo.findFavoriteWithUser(params.id, user._id);
        // If favorite exists
        if (!utility.isEmpty(favorite)) {
          await this.favoriteRepo.delete(favorite._id);
          returnVal.data = constants.SUCCESS_MESSAGES.OK;
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.FAV_NOT_FOUND);
        }
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_403, constants.ERROR_MESSAGES.NOT_AUTHORIZED);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for getting favorites for buyer
   *
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async favorites(user: TokenUser): Promise<ServiceReturnVal<Array<IFavorite>>> {
    const returnVal: ServiceReturnVal<Array<IFavorite>> = {};
    try {
      // If user is a buyer
      if (user.isSeller === false) {
        const query = { userId: user._id };
        const options = { sort: { createdAt: -1 } };
        const favorites: IFavorite[] = await this.favoriteRepo.find(query, undefined, options);
        returnVal.data = favorites;
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_403, constants.ERROR_MESSAGES.NOT_AUTHORIZED);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
}
