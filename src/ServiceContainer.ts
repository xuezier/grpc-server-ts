/**
 * @author Xuezi
 * @email xzj15859722542@hotmail.com
 * @create date 2018-06-14 06:11:20
 * @modify date 2018-06-14 06:11:20
 * @desc [description]
*/
import * as GRPC from 'grpc';
import * as protoLoader from '@grpc/proto-loader';

export class ServiceContainer {
  static services: { service: any, target: Function }[] = [];
  static routes: { target: Function, route: Function, func?: Function }[] = [];
  /**
   * @description registry grpc service
   * @author Xuezi
   * @static
   * @param {Function} target service constructor
   * @param {string} path proto file path
   * @memberof ServiceContainer
   */
  static registryService(target: Function, path: string) {
    let packageDefinition = protoLoader.loadSync(path, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
    let protoDescriptor = GRPC.loadPackageDefinition(packageDefinition);

    const packages = Object.keys(protoDescriptor);
    for (let packageKey of packages) {
      for (let key in protoDescriptor[packageKey]) {
        if (protoDescriptor[packageKey][key].hasOwnProperty('service')) {
          this.services.push({ service: protoDescriptor[packageKey][key]['service'], target });
        }
      }
    }
  }

  static registryRoute(target: Function, route: Function) {
    if (this.routes.find(r => (r.target === target && r.route === route))) {
      return;
    }

    this.routes.push({ target, route });
  }

  static generateRouteFunc(service: any, route: Function) {
    return this._generateRouteFunc(service, route);
  }

  private static _generateRouteFunc(service: any, route: Function): Function {
    let key = route.name;
    let rawFunc = service[key];
    let {requestStream, responseStream} = rawFunc;

    let response = function(e, call, data, callback) {
      if (responseStream) {
        if (e) return call.emit('error', e);
        if (data) call.write(data);
      } else {
        if (e) return callback(e);
        callback(null, data);
      }
    };

    let func = async function(call) {
      let callback = arguments[1];
      if (requestStream) {
        call.on('data', async function(data) {
          try {
            let result = await route(data);
            response(null, call, result, callback);
          } catch (e) {
            response(e, call, null, callback);
          }
        });
        call.on('error', error => {
          console.error(error);
        });
        call.on('end', function() {
          call.end && call.end();
        });
      } else {
        try {
          let result = await route(call.request);
          response(null, call, result, callback);
        } catch (e) {
          response(e, call, null, callback);
        }
      }
    };

    return func;
  }

  static getService(target: Function): any[] {
    let services = this.services.filter(service => service.target === target);
    return services;
  }
}
