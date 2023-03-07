import { register, login } from './users';

const paths = {
  '/services/register': {
    post: register,
  },
  '/services/login': {
    post: login,
  },
};

export default paths;
