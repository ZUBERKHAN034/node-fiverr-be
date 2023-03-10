import paths from './paths';
import tags from './tags';

const apiDocumentation = {
  openapi: '3.0.1',
  info: {
    version: '1.0.0',
    title: 'node-fiverr-be : (node fiverr backend) api Documentation',
    description: 'node-fiverr-be api Documentation in swagger',
    termsOfService: 'https://github.com/ZUBERKHAN034/node-fiverr-be',
    contact: {
      name: 'Zuber Khan',
      email: 'zuberkhan034@gmail.com',
      url: 'https://www.linkedin.com/in/zuberkhan034/',
    },
  },
  servers: [
    {
      url: 'http://localhost:8002/',
      description: 'Local Server',
    },
    {
      url: 'http://localhost:8002/', // replace it with deployed server url
      description: 'Production Server',
    },
  ],
  tags: tags,
  paths: paths,

  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
      },
    },
  },
};
export { apiDocumentation };
