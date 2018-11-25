import * as GRPC from 'grpc';
import * as FS from 'fs';

import { ServiceContainer } from './ServiceContainer';
import { SettingRegistry } from './SettingRegistry';

export class RpcRegistry {
  private static _port: number | string;
  private static _host: string;
  private static _ca: string;
  private static _cert: string;
  private static _key: string;

  private static _credentials: GRPC.ServerCredentials;

  static get port(): string | number {
    return this._port;
  }

  static get host(): string {
    return this._host;
  }

  static get ca(): string {
    return this._ca;
  }

  static get cert(): string {
    return this._cert;
  }

  static get key(): string {
    return this._key;
  }

  private static _server: GRPC.Server = new GRPC.Server();

  static get server() {
    return this._server;
  }

  static start() {
    this._loadSettings();
    this._registryService();
    this._addTls();
    this._start();
  }

  private static _start() {
    let address = `${this.host}:${this.port}`;
    this.server.bind(address, this._credentials);
    this.server.start();
  }

  private static _loadSettings() {
    let { port, host, ca, cert, key } = SettingRegistry.settings;
    this._port = port;
    this._host = host || '127.0.0.1';
    this._ca = ca;
    this._cert = cert;
    this._key = key;
  }


  private static _registryService() {
    for (let serviceContainer of ServiceContainer.services) {
      let rpc: { [x: string]: Function } = {};
      for (let key in serviceContainer.service) {
        let route = serviceContainer.target.prototype[key];
        if (route) {
          let routeContainer = ServiceContainer.routes.find(r => {
            return (r.target.constructor === serviceContainer.target && route === r.route)
          });

          let _func = ServiceContainer.generateRouteFunc(serviceContainer.service, route);
          routeContainer.func = _func;
          rpc[key] = routeContainer.func;
        }
      }
      this.server.addService(serviceContainer.service, rpc);
    }
  }

  private static _addTls() {
    if (!this.ca || !this.cert || !this.key) {
        this._credentials = GRPC.ServerCredentials.createInsecure()
    } else {
        let ca = FS.readFileSync(this.ca);
        let cert = FS.readFileSync(this.cert);
        let key = FS.readFileSync(this.key);
        this._credentials = GRPC.ServerCredentials.createSsl(ca, [{
        cert_chain: cert,
        private_key: key
        }], true);
    }
  }
}