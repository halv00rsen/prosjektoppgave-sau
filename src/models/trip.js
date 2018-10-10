
export default class Trip {

  constructor(id, name, startTime) {
    this.id = id;
    this.name = name;
    this.observations = [];
    this.done = false;
    this.startTime = startTime;
  }

  addObservation(observation) {
    this.observations.push(observation);
  }

}
