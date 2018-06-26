/**
 * @author Xuezi
 * @email xzj15859722542@hotmail.com
 * @create date 2018-06-14 05:58:38
 * @modify date 2018-06-14 05:58:38
 * @desc [description]
*/
import { ServiceContainer } from '../ServiceContainer';

export function Service(path: string) {
  return function (target: Function) {
    ServiceContainer.registryService(target, path);
  };
}