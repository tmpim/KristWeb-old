import { View } from "backbone.marionette";
import template from "./template-wallet-info.hbs";

export default View.extend({
  template,
  className: "topBar-addressInfo",

  modelEvents: {
    "all": "render"
  },

  templateContext: {
    krist(krist) {
      return Number(krist).toLocaleString() + " KST";
    }
  }
});