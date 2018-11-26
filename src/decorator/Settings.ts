import { Settings } from '../interface/Settings';
import { SettingRegistry } from '../SettingRegistry';

export function Settings(settings: Settings) {
  return function (_: Function) {
    SettingRegistry.registry(settings);
  };
}