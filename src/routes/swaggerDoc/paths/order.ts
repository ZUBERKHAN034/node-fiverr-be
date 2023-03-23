const security = [
  {
    cookieAuth: [],
  },
];

const createOrder = {
  tags: ['Orders'],
  description: 'Create Order',
  operationId: 'createOrder',
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
            gigId: {
              type: 'string',
              example: '6414a6c22030a6e645d0fa41',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Returns Ok as response on success',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '403': {
      description: 'You are unauthorized',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getOrders = {
  tags: ['Orders'],
  description: 'Get Completed Orders',
  operationId: 'getOrders',
  security: [
    {
      cookieAuth: [],
    },
  ],

  responses: {
    '200': {
      description: 'Returns Array of Orders Details or Empty Array.',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

export { createOrder, getOrders, security };
