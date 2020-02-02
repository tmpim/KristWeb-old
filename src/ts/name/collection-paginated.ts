import _ from "lodash";

import PageableCollection from "backbone.paginator";

import Name from "./model";
import app from "../app";

export default PageableCollection.extend({
  model: Name,

  initialize(models, options) {
    this.address = options ? options.address : null;
  },

  url() {
    if (this.address === "all") {
      return (app.syncNode || "https://krist.ceriat.net") + "/names";
    } else {
      return (app.syncNode || "https://krist.ceriat.net") + "/addresses/" + (this.address || app.activeWallet.boundAddress.get("address")) + "/names";
    }
  },

  parseRecords(data) {
    if (_.isObject(data.names)) {
      return data.names;
    }

    return data;
  },

  parseState(data) {
    return {
      totalRecords: data.total
    };
  },

  state: {
    firstPage: 0,
    pageSize: 15
  },

  queryParams: {
    pageSize: "limit",
    offset() { return this.state.currentPage * this.state.pageSize; },
    currentPage: null,
    totalPages: null,
    totalRecords: null
  }
});