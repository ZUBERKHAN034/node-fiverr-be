import { ParamsID, TokenUser } from '../types/request/base';
import { ReviewDetails } from '../types/request/review';
import { GigRepository, ReviewRepository } from '../db/repositories';
import { ServiceReturnVal } from '../types/common';
import { RespError } from '../lib/wr_response';
import { IReview } from '../db/models/review';
import { IGig } from '../db/models/gig';
import Base from './base';
import utility from '../lib/utility';
import constants from '../common/constants';

export default class ReviewService extends Base {
  private reviewRepo = new ReviewRepository();

  /**
   * Function for creating review by user
   *
   * @param {ReviewDetails}
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async create(params: ReviewDetails, user: TokenUser): Promise<ServiceReturnVal<IReview>> {
    const returnVal: ServiceReturnVal<IReview> = {};
    try {
      const gigRepo = new GigRepository();
      // If user is a seller then not allowed to add review
      if (user.isSeller === false) {
        const review: IReview = await this.reviewRepo.findReview(params.gigId, user._id);
        if (utility.isEmpty(review)) {
          const reviewParams = {
            userId: this.reviewRepo.toObjectId(user._id),
            gigId: this.reviewRepo.toObjectId(params.gigId),
            desc: params.desc,
            star: parseInt(params.star),
          } as IReview;

          const gigParams = { $inc: { totalStars: reviewParams.star, starNumber: 1 } } as unknown as IGig;
          await gigRepo.update(reviewParams.gigId, gigParams);
          returnVal.data = await this.reviewRepo.create(reviewParams);
        } else {
          returnVal.error = new RespError(
            constants.RESP_ERR_CODES.ERR_409,
            constants.ERROR_MESSAGES.REVIEW_ALREADY_EXISTS
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
   * Function for deleting review by user
   *
   * @param {ParamsID}
   * @param {TokenUser}
   * @returns {ServiceReturnVal}
   */
  public async delete(params: ParamsID, user: TokenUser): Promise<ServiceReturnVal<string>> {
    const returnVal: ServiceReturnVal<string> = {};
    try {
      // If user is not a seller
      if (user.isSeller === false) {
        const review = await this.reviewRepo.findReviewWithUser(params.id, user._id);
        // If review exists
        if (!utility.isEmpty(review)) {
          await this.reviewRepo.delete(params.id);
          returnVal.data = constants.SUCCESS_MESSAGES.OK;
        } else {
          returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_404, constants.ERROR_MESSAGES.REVIEW_NOT_FOUND);
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
   * Function for getting reviews with gigId
   *
   * @param {SearchParams}
   * @returns {ServiceReturnVal}
   */
  public async reviews(params: ParamsID): Promise<ServiceReturnVal<Array<IReview>>> {
    const returnVal: ServiceReturnVal<Array<IReview>> = {};
    try {
      const reviews: IReview[] = await this.reviewRepo.findReviewsByGigId(params);
      returnVal.data = reviews;
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
    }
    return returnVal;
  }
}
