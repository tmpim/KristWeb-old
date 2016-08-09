import _ from "lodash";

import {Model} from "backbone";
import LocalStorage from "backbone.localstorage";

import app from "../app";
import EncryptedLocalStorage from "../application/encrypted-local-storage";

export default Model.extend({
	defaults: {
		address: "",
		balance: 0,
		firstseen: ""
	},

	localStorage: new LocalStorage("Wallet", EncryptedLocalStorage)
});