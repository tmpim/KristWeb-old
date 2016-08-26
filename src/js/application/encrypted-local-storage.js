import app from "../app";

export default {
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
};