import AddWalletModalTemplate from "./template.hbs";
import AddWalletModalButtons from "./buttons.hbs";

import HelpWalletFormatsTemplate from "../help/wallet-formats.hbs";
import HelpSyncNodesTemplate from "../help/sync-nodes.hbs";

import Modal from "../modal";
import WalletIconModal from "../wallet-icon/modal";

import app from "../../app";
import Krist from "../../utils/krist";
import Wallet from "../../wallet/model";
import NProgress from "nprogress";
import zxcvbn from "zxcvbn";

export default Modal.extend({
  dialog: AddWalletModalTemplate,
  buttons: AddWalletModalButtons,

  title: "Add Wallet",

  extraData: {
    editing: false
  },

  events: {
    "click .wallet-format-help": "walletFormatHelp",
    "click .sync-node-help": "syncNodeHelp",
    "click #wallet-icon": "changeIcon",
    "click #advanced-collapse-button": "clickAdvancedCollapse"
  },

  walletFormatHelp() {
    app.layout.modals.show(new (Modal.extend({
      dialog: HelpWalletFormatsTemplate,
      title: "Help: Wallet Formats"
    }))());
  },

  syncNodeHelp() {
    app.layout.modals.show(new (Modal.extend({
      dialog: HelpSyncNodesTemplate,
      title: "Help: Sync Nodes"
    }))());
  },

  changeIcon() {
    let self = this;

    app.layout.modals.show(new (WalletIconModal.extend({
      success(imageData) {
        self.icon = imageData;

        self.$("#wallet-icon").text("").css("background-image", `url(${self.icon})`);
      },

      removeIcon() {
        self.icon = null;
        self.$("#wallet-icon").text("Icon").css("background-image", "");
      }
    }))());
  },

  clickAdvancedCollapse() {
    this.$("#advanced-collapse-button + .collapse-inner").slideToggle();
    this.$("#advanced-collapse-button .collapse-arrow").toggleClass("collapse-arrow-open");
  }

  beforeSubmit(e) {
    if (!this.$el.find("#wallet-password").val()) {
      e.preventDefault();
      this.$el.find("#wallet-password-label").removeClass("label-hidden").addClass("text-red").text("Field is required.");

      return false;
    } else {
      this.$el.find("#wallet-password-label").addClass("label-hidden").removeClass("text-red");
    }

    let format = this.$("#wallet-format").val();

    if (format === "kristwallet_username_appendhashes" || format === "kristwallet_username") {
      if (!this.$el.find("#wallet-username").val()) {
        e.preventDefault();
        this.$el.find("#wallet-username-label").removeClass("label-hidden").addClass("text-red").text("Field is required.");

        return false;
      } else {
        this.$el.find("#wallet-username-label").addClass("label-hidden").removeClass("text-red");
      }
    }
  },

  onShow() {
    if (app.epic) {
      this.$("#wallet-format").append("<option value=\"jwalelset\">jwalelset</option>");
      this.$("#wallet-format").val("jwalelset");
    }

    if (this.extraData.editing) {
      this.$("#wallet-label").val(this.model.get("label"));
      this.$("#wallet-username").val(this.model.get("username"));
      this.$("#wallet-password").val(this.model.get("password"));
      this.$("#wallet-format").val(this.model.get("format"));
      this.$("#wallet-syncnode").val(this.model.get("syncNode"));

      this.icon = this.model.get("icon");

      if (this.icon) {
        this.$("#wallet-icon").text("").css("background-image", `url(${this.icon})`);
      } else {
        this.$("#wallet-icon").text("Icon").css("background-image", "");
      }

      let format = this.$("#wallet-format").val();

      if (format === "kristwallet_username_appendhashes" || format === "kristwallet_username") {
        this.$("#wallet-username").removeClass("u-hidden");
        this.$("#wallet-username-label").removeClass("u-hidden");
      } else {
        this.$("#wallet-username").addClass("u-hidden");
        this.$("#wallet-username-label").addClass("u-hidden");
      }
    }

    let self = this;

    this.$("#wallet-format").selectize({
      onChange() {
        let val = self.$("#wallet-format").val();

        if (val === "kristwallet_username_appendhashes" || val === "kristwallet_username") {
          self.$("#wallet-username").removeClass("u-hidden");
          self.$("#wallet-username-label").removeClass("u-hidden");
        } else {
          self.$("#wallet-username").addClass("u-hidden");
          self.$("#wallet-username-label").addClass("u-hidden");
        }
      }
    });

    this.$("#wallet-password").on("keyup change click", () => {
      let password = this.$("#wallet-password").val();
      const score = password.length >= 48 ? 5 : zxcvbn(password).score;

      for (let i = 0; i <= 4; i++) {
        this.$("#password-strength").removeClass(`s${i}`);
      }

      this.$("#password-strength .strength-segment").each((i, segment) => {
        for (let i = 0; i <= 4; i++) {
          this.$(segment).removeClass(`s${i}`);
        }

        if (i <= score) {
          this.$(segment).addClass(`s${score}`);
        }
      });

      this.$("#password-strength").addClass(`s${score}`);
    });
  },

  submit() {
    NProgress.start();

    function sha256(a) {
      return window.CryptoJS.SHA256(a).toString();
    }

    let label = this.$("#wallet-label").val().substring(0, 30);
    let password = this.$("#wallet-password").val();
    let username = this.$("#wallet-username").val();
    let format = this.$("#wallet-format").val();
    let syncNode = this.$("#wallet-syncnode").val();
    let saveWallet = this.$("#wallet-save input[type=checkbox]").is(":checked");
    let icon = this.icon;

    let masterkey = "";

    switch (format) {
      case "kristwallet":
        masterkey = sha256("KRISTWALLET" + password) + "-000";
        break;
      case "kristwallet_username_appendhashes":
        masterkey = sha256("KRISTWALLETEXTENSION" + sha256(sha256(username) + "^" + sha256(password))) + "-000";
        break;
      case "kristwallet_username":
        masterkey = sha256(sha256(username) + "^" + sha256(password));
        break;
      default:
        masterkey = password;
    }

    let address = Krist.makeV2Address(masterkey);

    NProgress.set(0.5);

    if (this.extraData.editing) {
      this.model.set({
        address,
        label,
        icon,
        username,
        password,
        masterkey,
        syncNode,
        format
      });

      this.model.save();
    } else {
      let wallet = new Wallet({
        address,
        label,
        icon,
        username,
        password,
        masterkey,
        syncNode,
        format,
        position: app.wallets.length
      });

      if (saveWallet) {
        app.wallets.add(wallet);
        wallet.save();
      }

      app.switchWallet(wallet);
    }

    NProgress.done();
  }
});