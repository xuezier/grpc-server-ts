import { Settings } from "./interface/Settings";

export class SettingRegistry {
  static settings: Settings;

  static registry(settings: Settings) {
    this.settings = settings;
  }
}