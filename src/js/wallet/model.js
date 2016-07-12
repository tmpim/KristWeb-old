import {Model} from "backbone";
import LocalStorage from "backbone.localstorage";

import app from "../app";

export default Model.extend({
	defaults: {
		address: "",
		label: "",
		icon: "",
		username: "",
		format: ""
	},

	localStorage: new LocalStorage("Wallet", {
		serialize(item) {
			if (app.password) {
				return window.CryptoJS.AES.encrypt(JSON.stringify(item), app.password).toString();
			} else {
				return item;
			}
		},

		deserialize(data) {
			if (app.password) {
				return JSON.parse(window.CryptoJS.AES.decrypt(data, app.password).toString(window.CryptoJS.enc.Utf8));
			} else {
				return data;
			}
		}
	})
});