
export default class Observation {

  constructor(position, observedPosition) {
    this.position = {
      lat: position.lat,
      lng: position.lng,
    }
    this.observedPosition = {
      lat: observedPosition.lat,
      lng: observedPosition.lng,
    }
  }

}
