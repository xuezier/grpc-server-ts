import { ServiceContainer } from '../ServiceContainer';

export function Route(target: Function, key: string, { value: route }: { value: Function }) {
  if (!(route instanceof Function)) {
    throw new Error('Route decorator target must be a Function');
  }
  ServiceContainer.registryRoute(target, route);
}