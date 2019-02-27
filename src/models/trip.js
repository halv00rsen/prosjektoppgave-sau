
export default class Trip {

  constructor(id, name, startTime) {
    this.id = id;
    this.name = name;
    this.observations = [];
    this.positions = [];
    this.done = false;
    this.startTime = startTime;
    this.lastPosition = undefined;
    this.endTime = undefined;
  }

  addObservation(observation) {
    this.observations.push(observation);
  }

  addPosition(position) {
    if (this.lastPosition !== undefined) {
      console.log('Distance: ' + this.lastPosition.distanceTo(position));
    }
    if (this.lastPosition === undefined || this.lastPosition.distanceTo(position) > 10) {
      this.positions.push(position);
      this.lastPosition = position;
    }
  }

  editObservation(data, index) {
    if (index < 0 || index >= this.observations.length) {
      return;
    }
    this.observations[index] = data;
  }

  removeObservationAtIndex(index) {
    this.observations.splice(index, 1);
  }

}
