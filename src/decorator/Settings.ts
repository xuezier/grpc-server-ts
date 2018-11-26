import { Settings } from '../interface/Settings';
import { SettingRegistry } from '../SettingRegistry';

export function Settings(settings: Settings) {
  return function(target: any) {
    if (!(target instanceof Function)) {
      throw new Error('setting target must be a function');
    }
    SettingRegistry.registry(settings);
  };
}
