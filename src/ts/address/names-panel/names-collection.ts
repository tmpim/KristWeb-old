import _ from "lodash";

import { Collection } from "backbone";

import Name from "../../name/model";
import app from "../../app";

export default Collection.extend({
  model: Name,

  initialize(models, options) {
    this.address = options ? options.address : null;
  },

  url() {
    return (app.syncNode || "https://krist.ceriat.net") + "/addresses/" + this.address + "/names?limit=5";
  },

  parse(data) {
    if (_.isObject(data.names)) {
      return data.names;
    }

    return data;
  }
});