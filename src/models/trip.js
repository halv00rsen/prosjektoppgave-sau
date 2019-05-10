
function getInitialPositions()  {
  return {
    minLat: Number.MAX_SAFE_INTEGER,
    maxLat: Number.MIN_SAFE_INTEGER,
    minLng: Number.MAX_SAFE_INTEGER,
    maxLng: Number.MIN_SAFE_INTEGER,
  };
}

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
    this.boundsObservations = getInitialPositions();
    this.boundsPositions = getInitialPositions();
    this.boundsTotal = getInitialPositions();
    this.color = undefined;
    this.numSheep = 0;
    this.numPredators = 0;
  }

  addObservation(observation) {
    this.observations.push(observation);
    if (observation.isSheep) {
      this.numSheep += observation.numSheep;
    } else if (observation.predator) {
      this.numPredators += observation.numAnimals;
    }
    this.setCoordinates(observation.observedPosition, this.boundsObservations);
    this.setCoordinates(observation.position, this.boundsObservations);
  }

  getCenter() {
    return {
      lat: (this.boundsTotal.maxLat + this.boundsTotal.minLat) / 2,
      lng: (this.boundsTotal.maxLng + this.boundsTotal.minLng) / 2,
    };
  }

  getBounds() {
    return [
      [
        this.boundsTotal.minLat,
        this.boundsTotal.minLng,
      ], [
        this.boundsTotal.maxLat,
        this.boundsTotal.maxLng,
      ],
    ];
  }

  addPosition(position) {
    if (this.lastPosition !== undefined) {
      console.log('Distance: ' + this.lastPosition.distanceTo(position));
    }
    if (this.lastPosition === undefined || this.lastPosition.distanceTo(position) > 10) {
      this.positions.push(position);
      this.lastPosition = position;
      this.setCoordinates(position, this.boundsPositions);
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

  setCoordinates(pos, bounds) {
    for (let bound of [bounds, this.boundsTotal]) {
      bound.minLat = Math.min(bound.minLat, pos.lat);
      bound.maxLat = Math.max(bound.maxLat, pos.lat);
      bound.minLng = Math.min(bound.minLng, pos.lng);
      bound.maxLng = Math.max(bound.maxLng, pos.lng);
    }
  }

  positionInTripArea(pos) {
    return this.minLat <= pos.lat &&
           this.maxLat >= pos.lat &&
           this.minLng <= pos.lng &&
           this.maxLng >= pos.lng;
  }

  wholeTripInBound(bound) {
    return this.boundsTotal.minLat >= bound.minLat &&
           this.boundsTotal.minLng >= bound.minLng &&
           this.boundsTotal.maxLat <= bound.maxLat &&
           this.boundsTotal.maxLng <= bound.maxLng;
  }

  partOfTripInBound(bounds) {
    const total = this.boundsTotal;
    return !(
      total.minLat > bounds.maxLat ||
      total.maxLat < bounds.minLat ||
      total.minLng > bounds.maxLng ||
      total.maxLng < bounds.minLng
    );
  }

  calculateBounds() {
    for (let observation of this.observations) {
      this.setCoordinates(observation.observedPosition, this.boundsObservations);
      this.setCoordinates(observation.position, this.boundsObservations);
    }
    for (let position of this.positions) {
      this.setCoordinates(position, this.boundsPositions);
    }
  }

}
