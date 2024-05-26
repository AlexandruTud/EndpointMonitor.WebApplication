export class Endpoint {
  constructor(url, idType, idApplication, dateCreated, endpointState) {
    this.url = url;
    this.idType = idType;
    this.idApplication = idApplication;
    this.dateCreated = dateCreated;
    this.endpointState = endpointState;
  }
}
