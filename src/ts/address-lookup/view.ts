import app from "../app";

import { View } from "backbone.marionette";
import template from "./template.hbs";

export default View.extend({
  template,
  id: "address-lookup",

  ui: {
    address: "#address",
    search: "#address-search"
  },

  triggers: {
    "click @ui.search": "click:search"
  },

  events: {
    "keyup @ui.address": "onClickSearch"
  },

  onClickSearch(e) {
    if (e && e.keyCode && e.keyCode !== 13) return;

    let address = this.$el.find("#address").val();

    if (!address || !/^(?:[a-f0-9]{10}|k[a-z0-9]{9}|(?:[a-z0-9-_]{1,32}@)?[a-z0-9]{1,64}\.kst)$/i.test(address)) {
      this.$("#address-label").removeClass("label-hidden").addClass("text-red").text("Invalid address or name.");
      return;
    } else {
      this.$("#address-label").addClass("label-hidden").removeClass("text-red");
    }

    if (/^(?:[a-z0-9-_]{1,32}@)?[a-z0-9]{1,64}\.kst$/.test(address)) {
      app.router.navigate(`name/${encodeURIComponent(address)}`, { trigger: true });
    } else {
      app.router.navigate(`address/${encodeURIComponent(address)}`, { trigger: true });
    }
  }
});
