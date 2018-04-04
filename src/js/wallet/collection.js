import $ from "jquery";

import {Collection, Model} from "backbone";
import LocalStorage from "backbone.localstorage";

import app from "../app";

import WalletModel from "./model";
import EncryptedLocalStorage from "../application/encrypted-local-storage";

export default Collection.extend({
	model: WalletModel,

	localStorage: new LocalStorage("Wallet", EncryptedLocalStorage),

	fetch() {
		Model.prototype.fetch.apply(this, arguments);

		this.models.forEach(wallet => {
			const syncNode = wallet.get("syncNode") || "https://krist.ceriat.net";

			$.ajax(`${syncNode}/addresses/${encodeURIComponent(wallet.get("address"))}`).done(data => {
				if (!data.ok || !data.address) return;

				wallet.set("balance", data.address.balance);
				wallet.save();
			});
		});
	},

	viewComparator: "position"
});