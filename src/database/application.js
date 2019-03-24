
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
    const data = [];
    return this.database.iterate((value) => {
      const tripJson = JSON.parse(value);
      try {
        const trip = this._loadTrip(tripJson);
        data.push(trip);
      } catch {
        this.deleteTrip(tripJson.id);
      }
    }).then(() => {
      data.sort((a, b) => {
        return a.startTime - b.startTime;
      });
      callback(data);
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

  _loadTrip(data) {
    const trip = new Trip(data.id, data.name, data.startTime);
    trip.endTime = data.endTime;
    trip.done = data.done;
    for (let observation of data.observations) {
      observation.numSheep = observation.numSheep;
      observation.numLambs = observation.numLambs;
      trip.addObservation(observation);
    }
    trip.positions = data.positions;
    trip.calculateBounds();
    return trip;
  }

}
