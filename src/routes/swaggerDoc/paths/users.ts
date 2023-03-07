const security = [
  {
    bearerAuth: [],
  },
];

const registration = {
  tags: ['Users'],
  description: 'Create User Account',
  operationId: 'registration',
  requestBody: {
    content: {
      'application/x-www-form-urlencoded': {
        schema: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Dou',
            },
            email: {
              type: 'string',
              example: 'john@gmail.com',
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
const login = {
  tags: ['Users'],
  description: 'Login user in the system',
  operationId: 'login',
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
              firstName: {
                type: 'string',
                example: 'John',
              },
              lastName: {
                type: 'string',
                example: 'Dou',
              },
              email: {
                type: 'string',
                example: 'john@gmail.com',
              },
              role: {
                type: 'string',
                example: 'user',
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
  },
};

export { registration, login, security };
