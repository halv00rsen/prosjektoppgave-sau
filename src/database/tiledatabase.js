
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
        promises[i] = new Promise(function (resolve, reject) {
          var request = new XMLHttpRequest();
          request.open('GET', tileUrl.url, true);
          request.responseType = 'blob';
          request.onreadystatechange = function () {
            if (request.readyState === XMLHttpRequest.DONE) {
              if (request.status === 200) {
                self.callback(tileUrls.length, downloadCounter++);
                resolve(self._saveTile(tileUrl.key, request.response)); // .then((data) => {}));
              } else {
                reject(new Error(request.status + ' ' + request.statusText));
              }
            }
          };
          request.send();
        });
      })(i, tileUrl);
    }

    return Promise.all(promises);
  }

  clear() {
    return this.database.clear();
  }

  _saveTile(key, value) {
    return this._removeItem(key).then(function () {
      return this.database.setItem(key, value);
    }.bind(this));
  }

  _removeItem(key) {
    return this.database.removeItem(key);
  }

}
