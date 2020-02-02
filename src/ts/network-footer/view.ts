import { View } from "backbone.marionette";

import template from "./template.hbs";

export default View.extend({
  template,
  className: "panel",
  id: "krist-network-footer"
});