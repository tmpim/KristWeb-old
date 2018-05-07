import {ItemView} from "backbone.marionette";
import template from "./list-item.hbs";

import app from "../../app";

export default ItemView.extend({
	template: template,
	tagName: "li",
	className: "address-list-item",

	initialize(options) {
		this.collection = options.collection;
	},

	serializeData() {
		return {
			number: this.collection.indexOf(this.model) + 1,
			address: this.model.get("address"),
			balance: this.model.get("balance"),
			label: (app.friends && (app.friends.findWhere({ address: this.model.get("address"), syncNode: app.syncNode }) && app.friends.findWhere({ address: this.model.get("address"), syncNode: app.syncNode }).get("label"))) ||
			(app.wallets && (app.wallets.findWhere({ address: this.model.get("address"), syncNode: app.syncNode }) && app.wallets.findWhere({ address: this.model.get("address"), syncNode: app.syncNode }).get("label")))
		};
	}
});
