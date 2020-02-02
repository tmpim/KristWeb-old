import _ from "lodash";

import { View } from "backbone.marionette";
import template from "./template.hbs";

export default View.extend({
  template,
  className: "alert",

  ui: {
    closeButton: ".alert-close"
  },

  triggers: {
    "click @ui.closeButton": "click:close"
  },

  initialize(options) {
    this.title = options.title;
    this.text = options.text;
    this.parts = _.map(options.parts, part => typeof part === "string" ? { type: "text", text: part } : part);
    this.$el.addClass(options.style);
    this.$el.addClass("cf");
    this.hideCloseButton = options.hideCloseButton;
  },

  serializeData() {
    return {
      title: this.title,
      text: this.text,
      parts: this.parts,
      hideCloseButton: this.hideCloseButton
    };
  },

  onClickClose() {
    this.destroy();
  }
});