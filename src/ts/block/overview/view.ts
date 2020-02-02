import { View } from "backbone.marionette";
import template from "./template.hbs";

import app from "../../app";

export default View.extend({
  template,
  id: "block-overview",

  modelEvents: {
    "all": "render"
  },

  serializeData() {
    return {
      height: this.model.get("height"),
      address: this.model.get("address"),
      hash: this.model.get("hash"),
      short_hash: this.model.get("short_hash"),
      value: this.model.get("value") || 0,
      time: this.model.get("time"),
      difficulty: this.model.get("difficulty"),
      first: this.model.get("height") === 1,
      lastBlock: this.model.get("height") - 1,
      nextBlock: this.model.get("height") + 1
    };
  },

  templateContext: {
    krist(number) {
      return Number(number).toLocaleString() + " KST";
    },

    localise(number) {
      return Number(number).toLocaleString();
    },

    boldHash() {
      return `<b>${this.short_hash}</b>${this.hash.slice(this.short_hash.length)}`;
    }
  },

  onAttach() {
    this.$("#block-time").timeago();
  },

  onRender() {
    this.$("#block-time").timeago();
  }
});