import { registerUser, loginUser, deleteUser, logoutUser, uploadUserAssets } from './user';
import { createGig, deleteGig, getGig, getGigs } from './gig';

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
    get: getGigs,
  },
};

export default paths;
