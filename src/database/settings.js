
import localForage from 'localforage';

export default class SettingsDatabase {

  constructor() {
    this.database = localForage.createInstance({
      name: 'settingsDatabase',
    });
  }

  loadSettings() {
    return this.database.getItem('settings').then((data) => {
      return JSON.parse(data);
    });
  }

  saveSettings(settings) {
    return this.database.removeItem('settings').then(() => {
      return this.database.setItem('settings', JSON.stringify(settings));
    });
  }

}
