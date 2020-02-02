import { CollectionView } from "backbone.marionette";

import ListItemView from "./list-item";

export default CollectionView.extend({
  className: "col-xs-12",

  childView: ListItemView,
  childViewOptions() {
    return {
      collection: this.collection
    };
  },

  collectionEvents: {
    sort: "render"
  }
});