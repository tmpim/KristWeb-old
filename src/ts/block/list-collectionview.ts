import { CollectionView } from "backbone.marionette";
import template from "./template.hbs";

import ListItemView from "./list-item";

export default CollectionView.extend({
  template,
  className: "col-xs-12",

  childView: ListItemView,

  collectionEvents: {
    sort: "render"
  }
});