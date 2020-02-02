import { CollectionView } from "backbone.marionette";
import template from "./template.hbs";

import ActivityItemView from "./activity-view";

export default CollectionView.extend({
  template,
  className: "panel",

  initialize(options) {
    this.address = options.address;
  },

  childView: ActivityItemView,
  childViewContainer: "#activity-list",
  childViewOptions() {
    return {
      address: this.address
    };
  },

  collectionEvents: {
    sort: "render"
  }
});