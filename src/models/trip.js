
export default class Trip {

  constructor(participants) {
    this.participants = participants;
    this.observations = [];
  }

  addObservation(observation) {
    this.observations.push(observation);
  }

}
