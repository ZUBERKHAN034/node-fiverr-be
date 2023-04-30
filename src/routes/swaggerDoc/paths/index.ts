import {
  registerUser,
  loginUser,
  deleteUser,
  logoutUser,
  uploadUserAssets,
  getUser,
  getSetupAcctProfile,
  getVerifyLink,
  getForgotPassword,
  getSocialLogin,
} from './user';
import { createGig, deleteGig, getGig, getGigs, getMyGigs } from './gig';
import { createReview, deleteReview, getReviewsByGigId } from './review';
import { checkoutOrder, getOrders } from './order';
import { createMessage, getMessagesByConversationId } from './message';
import {
  createConversation,
  getConversationBySellerIdAndBuyerId,
  getConversations,
  getReceiverByConversationId,
  updateConversation,
} from './conversation';
import { createFavorite, deleteFavoriteByGigId, getFavorites } from './favorite';

const paths = {
  // USERS
  '/services/register': {
    post: registerUser,
  },
  '/services/login': {
    post: loginUser,
  },
  '/services/upload': {
    post: uploadUserAssets,
  },
  '/user': {
    post: deleteUser,
  },
  '/user/logout': {
    post: logoutUser,
  },
  '/services/user/{id}': {
    get: getUser,
  },
  '/user/setup-account': {
    post: getSetupAcctProfile,
  },
  '/services/verify-link': {
    post: getVerifyLink,
  },
  '/services/forgot-password': {
    post: getForgotPassword,
  },
  '/services/social-login': {
    post: getSocialLogin,
  },
  // GIGS
  '/gig': {
    post: createGig,
  },
  '/gig/{id}': {
    post: deleteGig,
  },
  '/services/gig/{id}': {
    get: getGig,
  },
  '/services/gigs': {
    post: getGigs,
  },
  '/my-gigs': {
    get: getMyGigs,
  },
  // REVIEWS
  '/review': {
    post: createReview,
  },
  '/review/{id}': {
    post: deleteReview,
  },
  '/services/reviews/{id}': {
    get: getReviewsByGigId,
  },
  // ORDERS
  '/order/checkout': {
    post: checkoutOrder,
  },
  '/orders': {
    get: getOrders,
  },
  // CONVERSATIONS
  '/conversation': {
    post: createConversation,
  },
  '/conversations': {
    get: getConversations,
  },
  '/conversation-read': {
    post: updateConversation,
  },
  '/conversation/{sellerId}/{buyerId}': {
    get: getConversationBySellerIdAndBuyerId,
  },
  '/conversation-receiver/{id}': {
    get: getReceiverByConversationId,
  },
  // MESSAGES
  '/message': {
    post: createMessage,
  },
  '/messages/{id}': {
    get: getMessagesByConversationId,
  },
  // FAVORITES
  '/favorite': {
    post: createFavorite,
  },
  '/favorite/{id}': {
    post: deleteFavoriteByGigId,
  },
  '/favorites': {
    get: getFavorites,
  },
};

export default paths;
