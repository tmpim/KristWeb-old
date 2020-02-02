import SecureRandom from "securerandom";

import LoginModalTemplate from "./template.hbs";
import LoginModalButtons from "./buttons.hbs";

import ForgotPasswordTemplate from "../forgot-password/template.hbs";
import ForgotPasswordButtons from "../forgot-password/buttons.hbs";

import WalletStorageTemplate from "../help/wallet-storage.hbs";

import Modal from "../modal";

import app from "../../app";

export default Modal.extend({
  dialog: LoginModalTemplate,
  buttons: LoginModalButtons,

  title: "Master Password",

  events: {
    "click .login-storage-help": "help",
    "click #login-forgot-password": "forgot"
  },

  extraData: {
    firstTime: false
  },

  help() {
    app.layout.modals.show(new (Modal.extend({
      dialog: WalletStorageTemplate,
      title: "Help: Wallet Storage"
    }))());
  },

  forgot() {
    app.layout.modals.show(new (Modal.extend({
      dialog: ForgotPasswordTemplate,
      buttons: ForgotPasswordButtons,
      title: "Forgot Password",

      events: {
        "click .login-storage-help": "help"
      },

      extraData: {
        feature: "Local Storage"
      },

      help() {
        app.layout.modals.show(new (Modal.extend({
          dialog: WalletStorageTemplate,
          title: "Help: Wallet Storage"
        }))());
      },

      submit() {
        localStorage.clear();

        location.reload();
      }
    }))());
  },

  beforeSubmit(e) {
    if (!this.$el.find("#login-password").val()) {
      e.preventDefault();
      this.$el.find("#login-label").removeClass("label-hidden").addClass("text-red").text("Field is required.");

      return false;
    } else {
      this.$el.find("#login-label").addClass("label-hidden").removeClass("text-red");
    }

    if (!this.extraData.firstTime) {
      let pass = this.$el.find("#login-password").val();

      let salt = localStorage.salt;
      let tester = localStorage.tester;

      let errored = false;

      try {
        var result = window.CryptoJS.AES.decrypt(tester, pass).toString(window.CryptoJS.enc.Utf8);
      } catch (e) {
        errored = true;
      }

      if (result !== salt || errored) {
        e.preventDefault();
        this.$el.find("#login-label").removeClass("label-hidden").addClass("text-red").text("Wallet password is incorrect.");

        return false;
      }
    }
  },

  submit() {
    let pass = this.$el.find("#login-password").val();

    if (this.extraData.firstTime) {
      let salt = SecureRandom.hex(32);
      let tester = window.CryptoJS.AES.encrypt(salt, pass).toString();

      localStorage.salt = salt;
      localStorage.tester = tester;
    }

    app.password = pass;

    if (this.success) {
      this.success();
    }
  }
});