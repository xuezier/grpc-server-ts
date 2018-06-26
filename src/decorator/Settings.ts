import { Settings } from '../interface/Settings';
import { SettingRegistry } from '../SettingRegistry';

export function Settings(settings: Settings) {
  return function (target: Function) {
    SettingRegistry.registry(settings);
  };
}