import { View } from "backbone.marionette";
import template from "./list-item.hbs";

import CommonMetaView from "./commonmeta/view";

import krist from "../utils/krist";

export default View.extend({
  template,
  tagName: "li",
  className: "activity-transaction",

  regions: {
    metadata: ".meta"
  },

  serializeData() {
    return {
      id: this.model.get("id"),
      from: this.model.get("from"),
      to: this.model.get("to"),
      value: this.model.get("value") || 0,
      time: this.model.get("time"),
      name: this.model.get("name"),
      metadata: this.model.get("metadata"),
      a: this.model.get("to") === "a",
      toName: this.model.get("to") === "name",
      commonMeta: krist.parseCommonMeta(this.model.get("metadata"))
    };
  },

  onAttach() {
    this.$("time").timeago();
  },

  onRender() {
    this.$("time").timeago();

    if (this.model.get("metadata")) {
      this.metadata.show(new CommonMetaView({
        model: this.model
      }));
    }
  }
});