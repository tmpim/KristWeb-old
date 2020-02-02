import Clipboard from "clipboard";

import ExportWalletsModalTemplate from "./template.hbs";
import ExportWalletsModalButtons from "./buttons.hbs";

import Modal from "../modal";

export default Modal.extend({
  dialog: ExportWalletsModalTemplate,
  buttons: ExportWalletsModalButtons,

  title: "Export Wallets",

  onShow() {
    let data = {
      salt: localStorage.salt,
      tester: localStorage.tester,
      wallets: {}
    };

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);

      if (key.startsWith("Wallet")) {
        data.wallets[key] = localStorage.getItem(key);
      }
    }

    let code = window.btoa(JSON.stringify(data));
    this.$("#wallets-code").text(code);

    setTimeout(() => {
      new Clipboard("#wallets-code-copy-to-clipboard");
    }, 200);
  }
});