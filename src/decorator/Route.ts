import { ServiceContainer } from '../ServiceContainer';

export function Route(target: any, _: string, { value: route }: { value?: any }) {
  if (!(route instanceof Function)) {
    throw new Error('Route decorator target must be a Function');
  }
  ServiceContainer.registryRoute(target, route);
}
