const security = [
  {
    cookieAuth: [],
  },
];

const registerUser = {
  tags: ['Users'],
  description: 'Create User Account',
  operationId: 'registerUser',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              example: 'john',
              required: true,
            },
            email: {
              type: 'string',
              example: 'john@gmail.com',
              required: true,
            },
            password: {
              type: 'string',
              example: 'sample',
              required: true,
            },
            country: {
              type: 'string',
              example: 'usa',
              required: true,
            },
            isSeller: {
              type: 'boolean',
              example: ['true', 'false'],
              required: true,
            },
            gender: {
              type: 'string',
              enum: ['male', 'female'],
              default: 'male',
              required: true,
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Registered',
    },
    '409': {
      description: 'User already exists',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const loginUser = {
  tags: ['Users'],
  description: 'Login user in the system',
  operationId: 'loginUser',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
              example: 'john or john@gmail.com',
            },
            password: {
              type: 'string',
              example: 'sample',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      description: 'User login successfully!',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              _id: {
                type: 'string',
                example: '6374e19dac314421985f43f5',
              },
              username: {
                type: 'string',
                example: 'John',
              },
              email: {
                type: 'string',
                example: 'john@gmail.com',
              },
              country: {
                type: 'string',
                example: 'usa',
              },
              gender: {
                type: 'string',
                example: 'male',
              },
              isSeller: {
                type: 'boolean',
                example: 'false',
              },
              token: {
                type: 'string',
                example:
                  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiQmh1dmEiLCJsYXN0X25hbWUiOiJCaGF2aW4iLCJmdWxsX25hbWUiOiJCaHV2YSBCaGF2aW4iLCJlbWFpbCI6ImJoYXZpbi5iMkBnbWFpbC5jb20iLCJyb2xlX25hbWUiOiJ1c2VyIiwiaWF0IjoxNjY1NzQxNjE5LCJleHAiOjE2NjU4MjgwMTl9.CCi2PeTODj4hEDavdwbpC5WHxbe9NLRE79n9aQrciKw',
              },
            },
          },
        },
      },
    },
    '404': {
      description: 'User not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const deleteUser = {
  tags: ['Users'],
  description: 'Delete User Account',
  operationId: 'deleteUser',
  security: [
    {
      cookieAuth: [],
    },
  ],
  responses: {
    '200': {
      description: 'Return OK response on successful delete operation',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '404': {
      description: 'User not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const logoutUser = {
  tags: ['Users'],
  description: 'Logout User Account',
  operationId: 'logoutUser',
  security: [
    {
      cookieAuth: [],
    },
  ],
  responses: {
    '200': {
      description: 'Return OK response on successful logged out',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '404': {
      description: 'User not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const uploadUserAssets = {
  tags: ['Users'],
  description: 'Upload User Assets',
  operationId: 'uploadUserAssets',
  requestBody: {
    content: {
      'multipart/form-data': {
        schema: {
          type: 'object',
          properties: {
            assets: {
              type: 'file',
              example: 'profile.png',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Returns URL of user assets on successful upload.',
    },
    '404': {
      description: 'File not found.',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getUser = {
  tags: ['Users'],
  description: 'get User Account by Id',
  operationId: 'getUser',
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'string',
        example: '6411ae6dd032c105a2f82d9d',
      },
      description: 'User Id',
    },
  ],
  responses: {
    '200': {
      description: 'Return Users Details',
    },
    '404': {
      description: 'User not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getSetupAcctProfile = {
  tags: ['Users'],
  description: 'Setup User Account Profile',
  operationId: 'getSetupAcctProfile',
  security: [
    {
      cookieAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            img: {
              type: 'string',
              example:
                'https://marketplace.canva.com/EAFEits4-uw/1/0/1600w/canva-boy-cartoon-gamer-animated-twitch-profile-photo-oEqs2yqaL8s.jpg',
            },
            desc: {
              type: 'string',
              example: 'Developer',
            },
            phone: {
              type: 'string',
              example: '+1 234 567 89',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Return Updated User  Details',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getVerifyLink = {
  tags: ['Users'],
  description: 'Verification link handler for users',
  operationId: 'getVerifyLink',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            hash: {
              type: 'string',
              example: 'd638d4e43708998526e20279',
              required: true,
            },
            password: {
              type: 'string',
              example: 'sample',
              required: false,
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Returns Ok on success',
    },
    '404': {
      description: 'Invalid link',
    },
    '410': {
      description: 'Link expired',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getForgotPassword = {
  tags: ['Users'],
  description: 'User Forgot Password',
  operationId: 'getForgotPassword',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              example: 'john@gmail.com',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'RESET PASSWORD link send successfully!',
    },
    '400': {
      description: 'User email must be valid format',
    },
    '404': {
      description: 'User not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getSocialLogin = {
  tags: ['Users'],
  description: 'Sign with google',
  operationId: 'getSocialLogin',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            credential: {
              type: 'string',
              example:
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdF9uYW1lIjoiQmh1dmEiLCJsYXN0X25hbWUiOiJCaGF2aW4iLCJmdWxsX25hbWUiOiJCaHV2YSBCaGF2aW4iLCJlbWFpbCI6ImJoYXZpbi5iMkBnbWFpbC5jb20iLCJyb2xlX25hbWUiOiJ1c2VyIiwiaWF0IjoxNjY1NzQxNjE5LCJleHAiOjE2NjU4MjgwMTl9.CCi2PeTODj4hEDavdwbpC5WHxbe9NLRE79n9aQrciKw',
            },
            country: {
              type: 'string',
              example: 'India',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '201': {
      description: 'User log in Successfully',
    },
    '400': {
      description: 'Validation Error',
    },
    '403': {
      description: 'You are unauthorized',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

export {
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
  security,
};
