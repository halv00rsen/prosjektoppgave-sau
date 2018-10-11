
export default class Trip {

  constructor(id, name, startTime) {
    this.id = id;
    this.name = name;
    this.observations = [];
    this.positions = [];
    this.done = false;
    this.startTime = startTime;
  }

  addObservation(observation) {
    this.observations.push(observation);
  }

  addPosition(position) {
    this.positions.push(position);
  }

}