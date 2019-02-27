
export default class Case {

  constructor() {
    this.filters = [];
  }

  addFilter(filter) {
    this.filters.push(filter);
  }

  getAllTrips() {
    for (let filter of this.filters) {
      console.log(filter);
    }
  }

}
