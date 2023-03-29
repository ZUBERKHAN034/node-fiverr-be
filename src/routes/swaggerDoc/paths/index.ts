import { registerUser, loginUser, deleteUser, logoutUser, uploadUserAssets, getUser } from './user';
import { createGig, deleteGig, getGig, getGigs } from './gig';
import { createReview, deleteReview, getReviewsByGigId } from './review';
import { createOrder, getOrders } from './order';
import { createConversation, getConversations, updateConversation } from './conversation';

const paths = {
  // USER
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
    delete: deleteUser,
  },
  '/user/logout': {
    post: logoutUser,
  },
  '/services/user/{id}': {
    get: getUser,
  },
  // GIG
  '/gig': {
    post: createGig,
  },
  '/gig/{id}': {
    delete: deleteGig,
  },
  '/services/gig/{id}': {
    get: getGig,
  },
  '/services/gigs': {
    post: getGigs,
  },
  // REVIEW
  '/review': {
    post: createReview,
  },
  '/review/{id}': {
    delete: deleteReview,
  },
  '/services/reviews/{id}': {
    get: getReviewsByGigId,
  },
  // ORDER
  '/order': {
    post: createOrder,
  },
  '/orders': {
    get: getOrders,
  },
  // CONVERSATION
  '/conversation': {
    post: createConversation,
  },
  '/conversations': {
    get: getConversations,
  },
  '/conversation-read': {
    post: updateConversation,
  },
};

export default paths;
