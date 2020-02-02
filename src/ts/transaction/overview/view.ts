import { View } from "backbone.marionette";
import template from "./template.hbs";

import CommonMetaView from "../commonmeta/view";

import krist from "../../utils/krist";

export default View.extend({
  template,
  id: "transaction-overview",

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
      lastTransaction: this.model.get("id") - 1,
      nextTransaction: this.model.get("id") + 1,
      a: this.model.get("to") === "a",
      toName: this.model.get("to") === "name",
      commonMeta: krist.parseCommonMeta(this.model.get("metadata"))
    };
  },

  templateContext: {
    localise(number) {
      return Number(number).toLocaleString();
    }
  },

  onAttach() {
    this.$("#transaction-time").timeago();
  },

  onRender() {
    this.$("#transaction-time").timeago();

    if (this.model.get("metadata")) {
      this.metadata.show(new CommonMetaView({
        model: this.model
      }));
    }
  }
});