const security = [
  {
    cookieAuth: [],
  },
];

const createReview = {
  tags: ['Reviews'],
  description: 'Create Review',
  operationId: 'createReview',
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
            desc: {
              type: 'string',
              example: 'This a test review.',
            },
            star: {
              type: 'number',
              enum: [1, 2, 3, 4, 5],
              example: 5,
            },
          },
        },
      },
    },
    required: true,
  },
  responses: {
    '200': {
      description: 'Returns review details on success',
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

const deleteReview = {
  tags: ['Reviews'],
  description: 'Delete Review By id',
  operationId: 'deleteReview',
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
        example: '6414a6c22030a6e645d0fa41',
      },
      description: 'Review id',
    },
  ],
  responses: {
    '200': {
      description: 'Returns OK on successful review deletion.',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '403': {
      description: 'You are unauthorized',
    },
    '404': {
      description: 'Review not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getReviewsByGigId = {
  tags: ['Reviews'],
  description: 'Get Reviews By Gig Id',
  operationId: 'getReviewsByGigId',
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'string',
        example: '6414a6c22030a6e645d0fa41',
      },
      description: 'gig id',
    },
  ],
  responses: {
    '200': {
      description: 'Returns Array of Reviews Details or Empty Array.',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

export { createReview, deleteReview, getReviewsByGigId, security };
