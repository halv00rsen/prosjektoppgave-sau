
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
    this.minLat = Number.MAX_SAFE_INTEGER;
    this.maxLat = Number.MIN_SAFE_INTEGER;
    this.minLng = Number.MAX_SAFE_INTEGER;
    this.maxLng = Number.MIN_SAFE_INTEGER;
  }

  addObservation(observation) {
    this.observations.push(observation);
    this.setCoordinates(observation.observedPosition);
    this.setCoordinates(observation.position);
  }

  addPosition(position) {
    if (this.lastPosition !== undefined) {
      console.log('Distance: ' + this.lastPosition.distanceTo(position));
    }
    if (this.lastPosition === undefined || this.lastPosition.distanceTo(position) > 10) {
      this.positions.push(position);
      this.lastPosition = position;
      this.setCoordinates(position);
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

  setCoordinates(pos) {
    this.minLat = Math.min(this.minLat, pos.lat);
    this.maxLat = Math.max(this.maxLat, pos.lat);
    this.minLng = Math.min(this.minLng, pos.lng);
    this.maxLng = Math.max(this.maxLng, pos.lng);
  }

  positionInTripArea(pos) {
    return this.minLat <= pos.lat && this.maxLat >= pos.lat &&
           this.minLng <= pos.lng && this.maxLng >= pos.lng;
  }

}
