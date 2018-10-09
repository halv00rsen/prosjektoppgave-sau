
import localForage from 'localforage';
// import Promise from 'promise';

export default class ApplicationDatabase {

  constructor() {
    this.database = localForage.createInstance({
      name: 'tripDatabase',
    });
  }

  getAllTrips(callback) {
    const datas = [];
    this.database.iterate((value, key, iterationNumber) => {
      datas.push(JSON.parse(value));
    }).then(() => {
      callback(datas);
    });
  }

  addTrip(trip) {
    return this.database.removeItem(trip.id).then(() => {
      return this.database.setItem(trip.id, JSON.stringify(trip));
    });
  }

  deleteTrip(id) {
    this.database.removeItem(id);
  }

}
