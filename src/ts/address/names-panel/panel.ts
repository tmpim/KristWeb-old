import { CollectionView } from "backbone.marionette";
import template from "./template.hbs";

import NameItemView from "./name-view";

export default CollectionView.extend({
  template,
  className: "panel",

  initialize(options) {
    this.address = options.address;
  },

  childView: NameItemView,
  childViewContainer: "#name-list",

  collectionEvents: {
    sort: "render"
  },

  serializeData() {
    return {
      address: this.address
    };
  }
});