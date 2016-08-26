import {Model} from "backbone";
import LocalStorage from "backbone.localstorage";

import app from "../app";
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
		position: 0
	},

	localStorage: new LocalStorage("Wallet", EncryptedLocalStorage)
});