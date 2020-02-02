import $ from "jquery";

import { Model } from "backbone";
import { LocalStorage } from "backbone.localstorage";

import EncryptedLocalStorage from "../application/encrypted-local-storage";

export default Model.extend({
  defaults: {
    address: "",
    label: "",
    icon: "",
    username: "",
    password: "",
    masterkey: "",
    format: "",
    syncNode: "https://krist.ceriat.net",
    balance: 0,
    position: 0
  },

  fetch() {
    Model.prototype.fetch.apply(this, arguments);

    const syncNode = this.get("syncNode") || "https://krist.ceriat.net";

    $.ajax(`${syncNode}/addresses/${encodeURIComponent(this.get("address"))}`).done(data => {
      if (!data.ok || !data.address) return;

      this.set("balance", data.address.balance);
      this.save();
    });
  },

  localStorage: new LocalStorage("Wallet", EncryptedLocalStorage)
});