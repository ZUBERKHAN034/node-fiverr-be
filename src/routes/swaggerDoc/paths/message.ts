const security = [
  {
    cookieAuth: [],
  },
];

const createMessage = {
  tags: ['Messages'],
  description: 'Create Message',
  operationId: 'createMessage',
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
            conversationId: {
              type: 'string',
              example: '6374e19dac314421985f43f5',
            },
            desc: {
              type: 'string',
              example: 'Hello this is a Test Message.',
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Returns message details on success',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getMessagesByConversationId = {
  tags: ['Messages'],
  description: 'Get Messages By Conversation Id',
  operationId: 'getMessagesByConversationId',
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
      description: 'Returns Array of Messages Details or Empty Array.',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

export { createMessage, getMessagesByConversationId, security };
