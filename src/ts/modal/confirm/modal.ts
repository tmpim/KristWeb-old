import ConfirmModalTemplate from "./template.hbs";
import ConfirmModalButtons from "./buttons.hbs";

import Modal from "../modal";

export default Modal.extend({
  dialog: ConfirmModalTemplate,
  buttons: ConfirmModalButtons,

  title: "Confirm",

  extraData: {
    text: "Are you sure?",
    buttonText: "Yes",
    bad: false
  },

  events: {
    "click .wallet-format-help": "walletFormatHelp",
    "click #wallet-icon": "changeIcon"
  }
});