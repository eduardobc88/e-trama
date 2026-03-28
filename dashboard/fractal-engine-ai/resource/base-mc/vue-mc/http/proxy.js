import toSafeInteger from 'lodash/toSafeInteger'

export default class ProxyResponse {

  constructor(status, data = {}, headers = {}) {
    this.data    = this.$_.defaultTo(data, {});
    this.headers = this.$_.defaultTo(headers, {});
    this.status  = this.$_.toSafeInteger(status);
  }

  getData() {
    return this.data;
  }

  getStatus() {
    return this.status;
  }

  getHeaders() {
    return this.headers;
  }

  getValidationErrors() {
    return this.data;
  }
}
