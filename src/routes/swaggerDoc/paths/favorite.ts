const security = [
  {
    cookieAuth: [],
  },
];

const createFavorite = {
  tags: ['Favorites'],
  description: 'Add Gig to Favorite',
  operationId: 'createFavorite',
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
              example: '642fe58b002944c7178ede75',
            },
            title: {
              type: 'string',
              example: 'This is test Gig title',
            },
            img: {
              type: 'string',
              example:
                'https://s3-bucket-public.s3.us-east-005.backblazeb2.com/fiverr/user/assets-1680860543905.jpg?x=1681053723886',
            },
            price: {
              type: 'number',
              example: 1000,
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
    '404': {
      description: 'Favorite already exists',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const deleteFavoriteByGigId = {
  tags: ['Favorites'],
  description: 'Remove Gig from Favorite',
  operationId: 'deleteFavoriteByGigId',
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
        example: '642fe58b002944c7178ede75',
      },
      description: 'Gig id',
    },
  ],
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

const getFavorites = {
  tags: ['Favorites'],
  description: 'Get Added Favorites Gigs',
  operationId: 'getFavorites',
  security: [
    {
      cookieAuth: [],
    },
  ],

  responses: {
    '200': {
      description: 'Returns Array of Favorites Details or Empty Array.',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

export { createFavorite, deleteFavoriteByGigId, getFavorites, security };
