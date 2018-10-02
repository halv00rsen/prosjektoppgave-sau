
import localForage from 'localforage';
import Promise from 'promise';

export default class TileDatabase {

  constructor(
    callback,
  ) {
    this.callback = callback;
  }

  getItem(key) {
    return localForage.getItem(key);
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
                resolve(self._saveTile(tileUrl.key, request.response).then(() => {
                  downloadCounter++;
                  self.callback(tileUrls.length, downloadCounter);
                }));
              } else {
                reject(new Error(request.status + ' ' + request.statusText));
                // reject({
                //   status: request.status,
                //   statusText: request.statusText,
                //   reason: new Error('No internet connection'),
                // });
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
    return localForage.clear();
  }

  _saveTile(key, value) {
    return this._removeItem(key).then(function () {
      return localForage.setItem(key, value);
    });
  }

  _removeItem(key) {
    return localForage.removeItem(key);
  }

}
