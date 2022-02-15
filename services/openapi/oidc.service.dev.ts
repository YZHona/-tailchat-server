import { TcService } from '../base';
import ApiGateway from 'moleculer-web';
import { Provider, Configuration } from 'oidc-provider';
import { config } from '../../lib/settings';

const ISSUER = config.apiUrl;

const configuration: Configuration = {
  // ... see /docs for available configuration
  clients: [
    {
      client_id: 'foo',
      client_secret: 'bar',
      redirect_uris: ['http://lvh.me:8080/cb'],
      // ... other client properties
    },
  ],
  async findAccount(ctx, id) {
    return {
      accountId: id,
      async claims(use, scope) {
        return { sub: id };
      },
    };
  },
};
export function createOIDCProvider() {
  const oidc = new Provider(ISSUER, configuration);

  return oidc;
}

class OIDCService extends TcService {
  provider = createOIDCProvider();

  get serviceName(): string {
    return 'openapi.oidc';
  }

  protected onInit(): void {
    this.registerMixin(ApiGateway);

    this.registerSetting('port', config.port);
    this.registerSetting('routes', this.getRoutes());
  }

  getRoutes() {
    return [
      {
        // Reference: https://github.com/moleculerjs/moleculer-web/blob/master/examples/file/index.js
        path: '/open',
        // You should disable body parsers
        bodyParsers: {
          json: false,
          urlencoded: false,
        },

        authentication: false,
        authorization: false,

        aliases: {
          // File upload from HTML form
          'GET /': (req, res) => {
            return this.provider.callback()(req, res);
          },
        },
      },
    ];
  }
}
export default OIDCService;
