const security = [
  {
    cookieAuth: [],
  },
];

const createGig = {
  tags: ['Gigs'],
  description: 'Create Gig',
  operationId: 'createGig',
  security: [
    {
      cookieAuth: [],
    },
  ],
  requestBody: {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              example: 'Web Developer Gig',
              required: true,
            },
            desc: {
              type: 'string',
              example: 'This is Web Developer Gig Description',
              required: true,
            },
            cat: {
              type: 'string',
              example: 'web',
              required: true,
            },
            cover: {
              type: 'string',
              example:
                'https://www.kapwing.com/resources/content/images/size/w1200/2022/01/Creating-a-Fiverr-Gig-Image.jpeg',
              required: true,
            },
            shortTitle: {
              type: 'string',
              example: 'Web Developer Gig Short Tittle',
              required: true,
            },
            price: {
              type: 'number',
              example: 59,
              required: true,
            },
            shortDesc: {
              type: 'string',
              example: 'Web Developer Gig Short Description',
              required: true,
            },
            deliveryTime: {
              type: 'number',
              example: 3,
              required: true,
            },
            revisionNumber: {
              type: 'number',
              example: 3,
              required: true,
            },
            sales: {
              type: 'number',
              example: 10,
              required: false,
            },
            starNumber: {
              type: 'number',
              example: 4,
              required: false,
            },
            totalStars: {
              type: 'number',
              example: 3,
              required: false,
            },
            images: {
              type: 'array',
              items: {
                type: 'string',
                example:
                  'https://assets-global.website-files.com/606a802fcaa89bc357508cad/61a66ca40534663ab0f2195f_Gig%20image%20guidelines%20-%20WIIF%20sellers-p-1080.png',
              },
            },
            features: {
              type: 'array',
              items: {
                type: 'string',
                example: 'feature-1',
              },
            },
          },
        },
      },
    },
  },
  responses: {
    '200': {
      description: 'Returns gig details on success',
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

const deleteGig = {
  tags: ['Gigs'],
  description: 'Delete Gig By id',
  operationId: 'deleteGig',
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
        example: 'd638d4e43708998526e20279',
      },
      description: 'Gig id',
    },
  ],
  responses: {
    '200': {
      description: 'Returns OK on successful gig deletion.',
    },
    '401': {
      description: 'You are unauthenticated',
    },
    '403': {
      description: 'You are unauthorized',
    },
    '404': {
      description: 'Gig not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getGig = {
  tags: ['Gigs'],
  description: 'Get Gig By id',
  operationId: 'getGig',
  parameters: [
    {
      in: 'path',
      name: 'id',
      required: true,
      schema: {
        type: 'string',
        example: 'd638d4e43708998526e20279',
      },
      description: 'Gig id',
    },
  ],
  responses: {
    '200': {
      description: 'Returns Gig Details.',
    },
    '404': {
      description: 'Gig not found',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};

const getGigs = {
  tags: ['Gigs'],
  description: 'Get All Gigs',
  operationId: 'getGigs',
  parameters: [
    {
      in: 'query',
      name: 'userId',
      required: false,
      schema: {
        type: 'string',
        example: 'd638d4e43708998526e20279',
      },
      description: 'Id of user',
    },
    {
      in: 'query',
      name: 'cat',
      required: false,
      schema: {
        type: 'string',
        example: 'web',
      },
      description: 'Category of Gig',
    },
    {
      in: 'query',
      name: 'min',
      required: false,
      schema: {
        type: 'number',
        example: 10,
      },
      description: 'Minimum Price of Gig',
    },
    {
      in: 'query',
      name: 'max',
      required: false,
      schema: {
        type: 'number',
        example: 100,
      },
      description: 'Maximum Price of Gig',
    },
    {
      in: 'query',
      name: 'search',
      required: false,
      schema: {
        type: 'string',
        example: 'web developer',
      },
      description: 'Search on Gig Title',
    },
    {
      in: 'query',
      name: 'sort',
      required: false,
      schema: {
        type: 'string',
        enum: ['asc', 'desc'],
      },
      description: 'Sorting by creation date',
    },
  ],
  responses: {
    '200': {
      description: 'Returns Array of Gigs Details or Empty Array.',
    },
    '500': {
      description: 'Internal server error',
    },
  },
};
export { createGig, deleteGig, getGig, getGigs, security };
