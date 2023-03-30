const security = [
  {
    cookieAuth: [],
  },
];

const createConversation = {
  tags: ['Conversations'],
  description: 'Create Conversation',
  operationId: 'createConversation',
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
            to: {
              type: 'string',
              example: '6374e19dac314421985f43f5',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Returns conversation details on success',
    },
    '401': {
      description: 'You are unauthenticated',
    },

    '500': {
      description: 'Internal server error',
    },
  },
};

const getConversations = {
  tags: ['Conversations'],
  description: 'Get Conversations',
  operationId: 'getConversations',
  security: [
    {
      cookieAuth: [],
    },
  ],

  responses: {
    '200': {
      description: 'Returns Array of Conversations Details or Empty Array.',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const updateConversation = {
  tags: ['Conversations'],
  description: 'Update Conversation By id',
  operationId: 'updateConversation',
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
            id: {
              type: 'string',
              example: '6374e19dac314421985f43f5',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Returns Updated Conversation Details.',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getConversationBySellerIdAndBuyerId = {
  tags: ['Conversations'],
  description: 'Get Conversations By Seller Id & Buyer Id',
  operationId: 'getConversationBySellerIdAndBuyerId',
  security: [
    {
      cookieAuth: [],
    },
  ],
  parameters: [
    {
      in: 'path',
      name: 'sellerId',
      required: true,
      schema: {
        type: 'string',
        example: '641eea9c64d418e14be8255a',
      },
      description: 'seller id',
    },
    {
      in: 'path',
      name: 'buyerId',
      required: true,
      schema: {
        type: 'string',
        example: '641eea9c64d418e14be8255a',
      },
      description: 'buyer id',
    },
  ],
  responses: {
    '200': {
      description: 'Returns Array of Messages Details or Empty Array.',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '404': {
      description: 'Conversation not found.',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getReceiverByConversationId = {
  tags: ['Conversations'],
  description: 'Get Receiver by Conversation Id',
  operationId: 'getReceiverByConversationId',
  security: [
    {
      cookieAuth: [],
    },
  ],
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'string',
        example: '641eea9c64d418e14be8255a',
      },
      description: 'conversation id',
    },
  ],
  responses: {
    '200': {
      description: 'Returns Receiver Details.',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

export {
  createConversation,
  getConversations,
  updateConversation,
  getConversationBySellerIdAndBuyerId,
  getReceiverByConversationId,
  security,
};
