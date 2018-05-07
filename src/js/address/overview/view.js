import {ItemView} from "backbone.marionette";
import template from "./template.hbs";

import app from "../../app";

export default ItemView.extend({
	template: template,
	id: "address-overview",

	ui: {
		sendKrist: "#send-krist"
	},

	triggers: {
		"click @ui.sendKrist": "click:sendKrist"
	},

	modelEvents: {
		"all": "render"
	},

	serializeData() {
		return {
			address: this.model.get("address"),
			balance: this.model.get("balance"),
			names: this.model.get("nameCount") || 0,
			fetchedNames: this.model.has("nameCount")
		};
	},

	templateHelpers: {
		pluralize(number, single, plural) {
			return Number(number) == 1 ? single : plural;
		}
	},

	onClickSendKrist() {
		app.sendKristTo = this.model.get("address");
		app.router.navigate("/transactions/make", true);
	}
});
