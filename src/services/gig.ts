import { ParamsID, TokenUser } from '../types/request/base';
import { GigDetails, SearchParams } from '../types/request/gig';
import { GigRepository } from '../db/repositories';
import { ServiceReturnVal } from '../types/common';
import { RespError } from '../lib/wr_response';
import { IGig } from '../db/models/gig';
import Base from './base';
import constants from '../common/constants';
import utility from '../lib/utility';

export default class GigService extends Base {
  private gigRepo = new GigRepository();

  /**
   * Function for creating gig by seller
   *
   * @param {GigDetails}
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async create(params: GigDetails, user: TokenUser): Promise<ServiceReturnVal<IGig>> {
    const returnVal: ServiceReturnVal<IGig> = {};
    try {
      // If user is a seller
      if (user.isSeller === true) {
        const gig = {
          userId: user._id,
          title: params.title,
          desc: params.desc,
          totalStars: params.totalStars,
          starNumber: params.starNumber,
          cat: params.cat,
          price: params.price,
          cover: params.cover,
          images: params.images ? [params.cover, ...params.images] : [params.cover],
          shortTitle: params.shortTitle,
          shortDesc: params.shortDesc,
          deliveryTime: params.deliveryTime,
          revisionNumber: params.revisionNumber,
          features: params.features,
          sales: params.sales,
        } as unknown as IGig;
        returnVal.data = await this.gigRepo.create(gig);
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_403, constants.ERROR_MESSAGES.NOT_AUTHORIZED);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for deleting gig by seller
   *
   * @param {ParamsID}
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async delete(params: ParamsID, user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      // If user is a seller
      if (user.isSeller === true) {
        const gig = await this.gigRepo.findGigWithUser(params.id, user._id);
        // If gig exists
        if (!utility.isEmpty(gig)) {
          await this.gigRepo.delete(params.id);
          returnVal.data = constants.SUCCESS_MESSAGES.OK;
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.GIG_NOT_FOUND);
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
   * Function for getting gig by id
   *
   * @param {ParamsID}
   * @returns {ServiceReturnVal}
   */
  public async gig(params: ParamsID): Promise<ServiceReturnVal<IGig>> {
    const returnVal: ServiceReturnVal<IGig> = {};
    try {
      const gig: IGig = await this.gigRepo.findGig(params);
      // If gig exists
      if (!utility.isEmpty(gig)) {
        returnVal.data = gig;
      } else {
        returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.GIG_NOT_FOUND);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }

  /**
   * Function for getting gigs with filters
   *
   * @param {SearchParams}
   * @returns {ServiceReturnVal}
   */
  public async gigs(params: SearchParams): Promise<ServiceReturnVal<Array<IGig>>> {
    const returnVal: ServiceReturnVal<Array<IGig>> = {};
    try {
      const gigs: IGig[] = await this.gigRepo.findGigs(params);
      returnVal.data = gigs;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
}
