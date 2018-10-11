
import localForage from 'localforage';
import Promise from 'promise';

export default class TileDatabase {

  constructor(
    callback,
  ) {
    this.callback = callback;
    this.database = localForage.createInstance({
      name: 'tileDatabase',
    });
  }

  getItem(key) {
    return this.database.getItem(key);
  }

  saveTiles(tileUrls) {
    const promises = [];
    const self = this;
    let downloadCounter = 0;

    for (var i = 0; i < tileUrls.length; i++) {
      var tileUrl = tileUrls[i];

      (function (i, tileUrl) {
        promises[i] = fetch(tileUrl.url).then((response) => {
          return response.blob();
        }).then((blob) => {
          return self._saveTile(tileUrl.key, blob);
        }).then(() => {
          downloadCounter++;
          return self.callback(downloadCounter / tileUrls.length);
        });
      })(i, tileUrl);
    }
    return Promise.all(promises);
  }

  clear() {
    return this.database.clear();
  }

  _saveTile(key, value) {
    return this._removeItem(key).then(() => {
      return this.database.setItem(key, value);
    });
  }

  _removeItem(key) {
    return this.database.removeItem(key);
  }

}
