import {ItemView} from "backbone.marionette";
import template from "./template.hbs";

import app from "../../app.js";

export default ItemView.extend({
	template: template,
	id: "address-overview",

	modelEvents: {
		"all": "render"
	},

	serializeData() {
		return {
			address: this.model.get("address"),
			balance: this.model.get("balance"),
			names: this.model.get("nameCount") || 0
		};
	},

	templateHelpers: {
		krist(number) {
			return Number(number).toLocaleString() + " KST";
		},

		pluralize(number, single, plural) {
			return Number(number) == 1 ? single : plural;
		}
	}
});