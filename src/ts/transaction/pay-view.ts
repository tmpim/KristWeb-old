import $ from "jquery";

import { View } from "backbone.marionette";
import template from "./pay-template.hbs";

import ConfirmModal from "../modal/confirm/modal";
import templatePayLargeConfirm from "./pay-large-confirm.hbs";

import RecipientContainer from "./recipient-container";

import AlertView from "../alert/view";
import GetErrorText from "../utils/errors";

import NProgress from "nprogress";
import Radio from "backbone.radio";

import app from "../app";

let appChannel = Radio.channel("global");

export default View.extend({
  template,
  id: "make-transaction",

  ui: {
    max: "#send-amount-max",
    send: "#transaction-send"
  },

  triggers: {
    "click @ui.max": "click:max",
    "click @ui.send": "click:send"
  },

  regions: {
    overview: "#overview",
    recipientContainer: "#recipient-container"
  },

  initialize() {
    if (app.sendKristTo) {
      this.sendKristTo = app.sendKristTo;
      app.sendKristTo = null;
    }

    appChannel.on("syncNode:changed", () => {
      if (!this.isDestroyed) this.render();
    });
  },

  onRender() {
    this.recipientView = new RecipientContainer({
      sendKristTo: this.sendKristTo
    });

    this.recipientContainer.show(this.recipientView);
  },

  onClickMax() {
    this.$el.find("#amount").val(app.activeWallet.get("balance").toString());
  },

  onClickSend() {
    let recipient = this.$el.find("#recipient").val();

    if (!recipient || !/^(?:[a-f0-9]{10}|k[a-z0-9]{9}|(?:[a-z0-9-_]{1,32}@)?[a-z0-9]{1,64}\.kst)$/i.test(recipient)) {
      this.$("#recipient-label").removeClass("label-hidden").addClass("text-red").text("Invalid address.");

      return;
    } else {
      this.$("#recipient-label").addClass("label-hidden").removeClass("text-red");
    }

    let amount = Number(this.$el.find("#amount").val());

    if (!amount || amount <= 0) {
      this.$("#amount-label").removeClass("label-hidden").addClass("text-red").text("Invalid amount.");

      return;
    } else {
      this.$("#amount-label").addClass("label-hidden").removeClass("text-red");
    }

    let metadata = this.$el.find("#metadata").val().substring(0, 255) || null;

    if (app.activeWallet && app.activeWallet.get("balance")) {
      const balance = app.activeWallet.get("balance");

      if (amount >= balance / 2) {
        const self = this;
        return app.layout.modals.show(new (ConfirmModal.extend({
          title: "Send Krist",
          extraData: {
            text: templatePayLargeConfirm({
              amount: amount.toLocaleString() + " KST",
              all: balance === amount
            }),
            bad: true
          },

          submit() {
            self.send(recipient, amount, metadata);
          }
        }))());
      }
    }

    this.send(recipient, amount, metadata);
  },

  send(recipient, amount, metadata) {
    const self = this;

    NProgress.start();

    $.ajax({
      method: "post",
      url: `${app.syncNode}/transactions`,
      data: {
        to: recipient,
        amount,
        metadata,
        privatekey: app.activeWallet.get("masterkey")
      },
      dataType: "json"
    }).done(response => {
      if (!response || !response.ok) {
        NProgress.done();
        console.error(response);

        return self.overview.show(new AlertView({
          title: "Error",
          text: GetErrorText(response),
          style: "red"
        }));
      }

      app.activeWallet.boundAddress.fetch();

      NProgress.done();

      self.overview.show(new AlertView({
        title: "Success",
        parts: [
          "Successfully sent ",
          { type: "krist", amount },
          " to ",
          { type: "address", address: recipient },
          "."
        ],
        style: "green"
      }));
    }).fail(response => {
      NProgress.done();
      console.error(response);

      return self.overview.show(new AlertView({
        title: "Error",
        text: GetErrorText(response),
        style: "red"
      }));
    });
  }
});
