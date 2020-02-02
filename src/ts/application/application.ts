import $ from "jquery";
import _ from "lodash";
import { Application } from "backbone.marionette";
import View from "./layout-view";

import SidebarService from "../sidebar/service";
import WebsocketService from "./websockets";

import Address from "../address/model";

import WalletCollection from "../wallet/collection";
import WalletChooserView from "../wallet/chooser-view";
import WalletInfoView from "../wallet/view-wallet-info";

import FriendCollection from "../friends/collection";

import Router from "../router";
import Radio from "backbone.radio";

import NProgress from "nprogress";

import Modal from "../modal/modal";
import GetErrorText from "../utils/errors";

let walletChannel = Radio.channel("wallet");
let appChannel = Radio.channel("global");

export default Application.extend({
  initialize() {
    if (location.protocol !== "https:") {
      $("body").addClass("http");
    }

    _.extend(NProgress.settings, {
      showSpinner: false
    });

    this.layout = new View();
    this.layout.render();

    SidebarService.setup({
      container: this.layout.sidebar
    });

    this.router = new Router({
      container: this.layout.content
    });

    appChannel.on("syncNode:changed", syncNode => {
      this.syncNodeChanged(syncNode);
    });

    walletChannel.on("wallet:activeChanged", () => {
      if (this.layout.ui.loginFirst) {
        this.layout.ui.loginFirst.remove();
      }
    });
  },

  error(title, text) {
    this.layout.modals.show(new (Modal.extend({
      title,
      dialog: text
    }))());
  },

  passwordReady() {
    this.wallets = new WalletCollection();
    this.wallets.fetch();

    this.friends = new FriendCollection();
    this.friends.fetch();

    if (localStorage.activeWallet && this.wallets.has(localStorage.activeWallet)) {
      this.switchWallet(this.wallets.get(localStorage.activeWallet));
    } else if (this.wallets.length > 0) {
      this.switchWallet(this.wallets.at(0));
    }

    let walletChooserView = new WalletChooserView({
      collection: this.wallets,
      container: this.layout.walletList
    });

    this.layout.walletList.show(walletChooserView);
  },

  switchWallet(wallet) {
    NProgress.start();

    let self = this;
    this.activeWallet = wallet;

    localStorage.activeWallet = wallet.get("id");

    walletChannel.trigger("wallet:activeChanging", wallet);

    let syncNode = wallet.get("syncNode") || "https://krist.ceriat.net";
    let didSyncNodeChange = false;

    if (!this.syncNode || this.syncNode !== syncNode) {
      didSyncNodeChange = true;
    }

    this.syncNode = syncNode;

    if (didSyncNodeChange) {
      appChannel.trigger("syncNode:changed", syncNode);
    }

    $.ajax(syncNode + "/login", {
      method: "POST",
      data: {
        privatekey: wallet.get("masterkey")
      }
    }).done(data => {
      if (!data || !data.ok) {
        NProgress.done();
        console.error(data);
        this.activeWallet = null;
        walletChannel.trigger("wallet:changeFailed", wallet, didSyncNodeChange);
        return this.error("Unknown Error", `Server returned an error: ${GetErrorText(data)}`);
      }

      if (!data.authed) {
        NProgress.done();
        this.activeWallet = null;
        walletChannel.trigger("wallet:changeFailed", wallet, didSyncNodeChange);
        return this.error("Authentication Failed", "You are not the owner of this wallet.");
      }

      $.ajax(syncNode + "/addresses/alert", {
        method: "POST",
        data: {
          privatekey: wallet.get("masterkey")
        }
      }).done(alertData => {
        if (alertData.ok && alertData.alert && alertData.alert.length >= 1) {
          self.error("Server Alert", alertData.alert);

          let span = $("<span class=\"alert-test\"></span>");
          span.text(alertData.alert);

          self.layout.ui.alert.hide().empty().append(span);
          self.layout.ui.alert.slideDown();
        } else {
          self.layout.ui.alert.slideUp(() => {
            self.layout.ui.alert.empty();
          });
        }

        NProgress.set(0.5);

        let address = new Address({
          address: data.address
        });

        address.fetch({
          success(model, response) {
            if (!response || !response.ok) {
              NProgress.done();
              console.error(response);
              self.activeWallet = null;
              walletChannel.trigger("wallet:changeFailed", wallet, didSyncNodeChange);
              return self.error("Error", `Server returned an error: ${GetErrorText(response)}`);
            }

            self.activeWallet.boundAddress = model;

            walletChannel.trigger("wallet:activeChanged", wallet, didSyncNodeChange);
            self.layout.topBarAddressInfo.show(new WalletInfoView({
              model
            }));

            $.ajax(`${syncNode}/addresses/${encodeURIComponent(model.get("address"))}/names`).done(data => {
              self.activeWallet.nameCount = data.total || 0;

              walletChannel.trigger("names:count", data.total || 0);

              NProgress.done();
            }).fail(NProgress.done);

            NProgress.set(0.75);
          },

          error(model, response) {
            NProgress.done();

            console.error(response);

            self.activeWallet = null;
            walletChannel.trigger("wallet:changeFailed", wallet, didSyncNodeChange);

            return self.error("Error", `Server returned an error: ${GetErrorText(response)}`);
          }
        });
      });
    }).fail((jqXHR, textStatus, error) => {
      NProgress.done();

      return this.error("Unknown Error", `Failed to connect to the sync node: ${GetErrorText(error)}`);
    });
  },

  syncNodeChanged(syncNode) {
    let self = this;

    $.ajax(syncNode + "/motd").done(data => {
      self.motd = data;

      appChannel.trigger("motd:changed", data);
    });

    WebsocketService.request("connect");
  }
});
