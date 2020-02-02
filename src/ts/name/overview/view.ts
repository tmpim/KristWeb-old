import { View } from "backbone.marionette";
import template from "./template.hbs";

import UpdateNameModal from "../../modal/update-name/modal";
import TransferNameModal from "../../modal/transfer-name/modal";

import app from "../../app";
import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

const recordRegex = /^(\w+:\/\/)/;

function formatA(record) {
  if (!record) return;

  if (!recordRegex.test(record)) {
    return "http://" + record;
  } else {
    return record;
  }
}

export default View.extend({
  template,
  id: "name-overview",

  modelEvents: {
    "all": "render"
  },

  ui: {
    updateARecord: "#update-a-record",
    transferName: "#transfer-name"
  },

  triggers: {
    "click @ui.updateARecord": "update:a",
    "click @ui.transferName": "transfer:name"
  },

  initialize() {
    walletChannel.on("wallet:activeChanged", () => {
      if (!this.isDestroyed) this.render();
    });
  },

  serializeData() {
    return {
      name: this.model.get("name"),
      owner: this.model.get("owner"),
      a: formatA(this.model.get("a")),
      registered: this.model.get("registered"),
      updated: this.model.get("updated"),
      transferred: this.model.get("registered") !== this.model.get("updated"),
      isOwn: app.activeWallet && this.model.get("owner") === app.activeWallet.boundAddress.get("address")
    };
  },

  onAttach() {
    this.$("time").timeago();
  },

  onRender() {
    this.$("time").timeago();
  },

  onUpdateA() {
    app.layout.modals.show(new (UpdateNameModal.extend({
      model: this.model
    }))());
  },

  onTransferName() {
    app.layout.modals.show(new (TransferNameModal.extend({
      model: this.model
    }))());
  }
});