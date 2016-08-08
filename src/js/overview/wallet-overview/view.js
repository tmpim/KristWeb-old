import {ItemView} from "backbone.marionette";
import template from "./template.hbs";

import app from "../../app.js";

import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

export default ItemView.extend({
	template: template,
	id: "wallet-overview",

	modelEvents: {
		"all": "render"
	},

	initialize() {
		walletChannel.on("wallet:activeChanged", (wallet) => {
			if (this.isDestroyed) {
				return;
			}

			this.render();
		});
	},

	templateHelpers: {
		loggedIn() {
			return typeof app.activeWallet !== "undefined" && app.activeWallet !== null;
		},

		address() {
			return app.activeWallet.boundAddress.get("address");
		},

		balance() {
			return app.activeWallet.boundAddress.get("balance").toLocaleString() + " KST";
		},

		pluralize(number, single, plural) {
			return number === 1 ? single : plural;
		}
	}
});