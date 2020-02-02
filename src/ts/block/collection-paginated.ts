import _ from "lodash";

import PageableCollection from "backbone.paginator";

import Block from "./model";
import app from "../app";

export default PageableCollection.extend({
  model: Block,

  initialize(models, options) {
    this.lowest = options ? options.lowest : null;
  },

  url() {
    return (app.syncNode || "https://krist.ceriat.net")
      + "/blocks/"
      + (this.lowest ? "lowest" : "latest");
  },

  parseRecords(data) {
    if (_.isObject(data.blocks)) {
      return data.blocks;
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