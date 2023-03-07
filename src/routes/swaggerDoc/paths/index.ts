import { registration, login } from './users';

const paths = {
  '/services/registration': {
    post: registration,
  },
  '/services/login': {
    post: login,
  },
};

export default paths;
