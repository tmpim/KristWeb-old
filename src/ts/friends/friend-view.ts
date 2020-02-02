import { View } from "backbone.marionette";
import template from "./friend-template.hbs";

import ConfirmModal from "../modal/confirm/modal";
import Radio from "backbone.radio";

import app from "../app";

let friendChannel = Radio.channel("friend");

export default View.extend({
  template,
  className: "wallet-chooser-wallet",

  ui: {
    remove: ".wallet-control-remove"
  },

  triggers: {
    "click @ui.remove": "click:remove",
    "click": "click:this"
  },

  modelEvents: {
    change: "render"
  },

  onRender() {
    this.$el.attr("data-id", this.model.get("id"));
  },

  onShow() {
    this.$el.attr("data-id", this.model.get("id"));

    if (app.selectedFriend && app.selectedFriend == this.model) {
      this.$el.addClass("active");
    } else {
      this.$el.removeClass("active");
    }
  },

  serializeData() {
    return {
      address: this.model.get("address"),
      label: this.model.get("label"),
      icon: this.model.get("icon"),
      isName: this.model.get("isName"),
      active: app.selectedFriend && app.selectedFriend == this.model
    };
  },

  onClickThis() {
    app.selectedFriend = this.model;

    friendChannel.trigger("friendsList:activeChanged", this.model);
  },

  onClickRemove() {
    let self = this;

    app.layout.modals.show(new (ConfirmModal.extend({
      title: "Remove Contact",
      extraData: {
        text: "Are you sure you want to remove this contact?",
        bad: true
      },

      submit() {
        self.model.destroy();
      }
    }))());
  }
});