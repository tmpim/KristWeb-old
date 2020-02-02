import $ from "jquery";

import UpdateNameModalTemplate from "./template.hbs";
import UpdateNameModalButtons from "./buttons.hbs";

import Modal from "../modal";

import NProgress from "nprogress";
import GetErrorText from "../../utils/errors";

import app from "../../app";

export default Modal.extend({
  dialog: UpdateNameModalTemplate,
  buttons: UpdateNameModalButtons,

  title: "Update A Record",

  onShow() {
    this.$("#a-record").val(this.model.get("a"));
  },

  submit() {
    NProgress.start();

    $.ajax(app.syncNode + "/names/" + this.model.get("name"), {
      method: "PUT",
      data: {
        a: this.$("#a-record").val(),
        privatekey: app.activeWallet.get("masterkey")
      }
    }).done(data => {
      NProgress.done();

      if (!data || !data.ok) {
        console.error(data);
        return app.error("Unknown Error", `Server returned an error: ${GetErrorText(data)}`);
      }

      this.model.set(data.name);
    }).fail((jqXHR, textStatus, error) => {
      NProgress.done();

      return app.error("Unknown Error", `Failed to connect to the sync node: ${GetErrorText(error)}`);
    });
  }
});