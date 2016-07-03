import {Collection} from "backbone";
import LocalStorage from "backbone.localstorage";

import app from "../app";

import WalletModel from "./model";

export default Collection.extend({
	model: WalletModel,

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