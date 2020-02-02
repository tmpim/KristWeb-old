import { View } from "backbone.marionette";
import template from "./template.hbs";

import RegisterNameModal from "../../modal/register-name/modal";

import app from "../../app";

import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

export default View.extend({
  template,
  id: "wallet-overview",

  ui: {
    sendKrist: "#send-krist",
    buyName: "#buy-name"
  },

  triggers: {
    "click @ui.sendKrist": "click:sendKrist",
    "click @ui.buyName": "click:buyName"
  },

  modelEvents: {
    "all": "render"
  },

  initialize(options) {
    this.hideNames = options.hideNames;
    this.showAllTransactionsButton = options.showAllTransactionsButton;
    this.showAllNamesButton = options.showAllNamesButton;
    this.nameCount = options.nameCount;
    this.buyName = options.buyName;

    walletChannel.on("wallet:activeChanged", () => {
      if (!this.isDestroyed) this.render();
    });

    walletChannel.on("names:count", () => {
      if (!this.isDestroyed) this.render();
    });
  },

  serializeData() {
    return {
      address: this.model.get("address"),
      balance: this.model.get("balance"),
      hideNames: this.hideNames,
      nameCount: this.nameCount,
      buyName: this.buyName,
      showAllTransactionsButton: this.showAllTransactionsButton,
      showAllNamesButton: this.showAllNamesButton,
      isOwn: app.activeWallet && this.model.get("address") === app.activeWallet.boundAddress.get("address"),
      fetchedNames: app.activeWallet && typeof app.activeWallet.nameCount !== "undefined" && app.activeWallet.nameCount !== null
    };
  },

  templateContext: {
    loggedIn() {
      return typeof app.activeWallet !== "undefined" && app.activeWallet !== null;
    },

    krist(balance) {
      return balance.toLocaleString() + " KST";
    },

    names() {
      if (this.hideNames) return;

      if (this.nameCount) {
        return this.nameCount;
      }

      if (app.activeWallet && app.activeWallet.nameCount) {
        return app.activeWallet.nameCount;
      }

      return 0;
    },

    pluralize(number, single, plural) {
      return Number(number) == 1 ? single : plural;
    }
  },

  onClickSendKrist() {
    app.sendKristTo = this.model.get("address");
    app.router.navigate("/transactions", true);
  },

  onClickBuyName() {
    app.layout.modals.show(new RegisterNameModal());
  }
});