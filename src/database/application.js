
import localForage from 'localforage';
import Trip from '@/models/trip';
// import Observation from '../models/observation';
// import Promise from 'promise';

export default class ApplicationDatabase {

  constructor() {
    this.database = localForage.createInstance({
      name: 'tripDatabase',
    });
  }

  getAllTrips(callback) {
    const datas = [];
    return this.database.iterate((value) => {
      const data = JSON.parse(value);
      const trip = new Trip(data.id, data.name, data.startTime);
      trip.endTime = data.endTime;
      trip.done = data.done;
      for (let observation of data.observations) {
        observation.numSheep = Number(observation.numSheep);
        observation.numLambs = Number(observation.numLambs);
        trip.addObservation(observation);
      }
      trip.positions = data.positions;
      datas.push(trip);
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
