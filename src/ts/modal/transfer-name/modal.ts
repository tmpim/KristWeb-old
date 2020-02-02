import $ from "jquery";

import TransferNameModalTemplate from "./template.hbs";
import TransferNameModalButtons from "./buttons.hbs";

import Modal from "../modal";

import RecipientContainer from "../../transaction/recipient-container";

import NProgress from "nprogress";
import GetErrorText from "../../utils/errors";

import app from "../../app";

export default Modal.extend({
  dialog: TransferNameModalTemplate,
  buttons: TransferNameModalButtons,

  title: "Transfer Name",

  onShow() {
    this.$el.click(function(e) {
      if (e.target === this) {
        return false;
      }
    });

    this.$(".bbm-modal").css("overflow", "visible");

    this.recipientView = new RecipientContainer();
    this.$("#recipient-container").empty().append(this.recipientView.render().el);

    let recipient = this.$("#recipient");

    recipient.attr("tabindex", "2");

    recipient.selectize({
      plugins: {
        "dropdown_header": {
          title: "Press backspace to enter a custom address."
        }
      },
      create: true,
      persist: false,
      closeAfterSelect: true,
      placeholder: "Recipient",
      createFilter: /^(?:[a-f0-9]{10}|k[a-z0-9]{9}|[a-z0-9]{1,64}\.kst)$/
    });
  },

  beforeSubmit() {
    let recipient = this.$("#recipient").val();

    if (!recipient || !/^(?:[a-f0-9]{10}|k[a-z0-9]{9}|[a-z0-9]{1,64}\.kst)$/i.test(recipient)) {
      this.$("#recipient-label").removeClass("label-hidden").addClass("text-red").text("Invalid address.");

      return false;
    } else {
      this.$("#recipient-label").addClass("label-hidden").removeClass("text-red");
    }
  },

  submit() {
    let recipient = this.$("#recipient").val();

    NProgress.start();

    $.ajax(app.syncNode + "/names/" + this.model.get("name") + "/transfer", {
      method: "POST",
      data: {
        address: recipient,
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
