import {ItemView} from "backbone.marionette";
import template from "./activity-template.hbs";

import app from "../../app";

export default ItemView.extend({
	template: template,
	tagName: "li",
	className: "activity-transaction",

	modelEvents: {
		"change": "render"
	},

	serializeData() {
		return {
			id: this.model.get("id"),
			from: this.model.get("from"),
			to: this.model.get("to"),
			value: this.model.get("value") || 0,
			time: this.model.get("time"),
			name: this.model.get("name"),
			metadata: this.model.get("metadata"),
			in: app.activeWallet ? this.model.get("to") === app.activeWallet.boundAddress.get("address") : null,
			label: (this.model.get("to") === app.activeWallet.boundAddress.get("address") ?
			((app.friends.findWhere({ address: this.model.get("from"), syncNode: app.syncNode }) && app.friends.findWhere({ address: this.model.get("from"), syncNode: app.syncNode }).get("label")) ||
			(app.wallets.findWhere({ address: this.model.get("from"), syncNode: app.syncNode }) && app.wallets.findWhere({ address: this.model.get("from"), syncNode: app.syncNode }).get("label"))) :
			((app.friends.findWhere({ address: this.model.get("to"), syncNode: app.syncNode }) && app.friends.findWhere({ address: this.model.get("to"), syncNode: app.syncNode }).get("label")) ||
			(app.wallets.findWhere({ address: this.model.get("to"), syncNode: app.syncNode }) && app.wallets.findWhere({ address: this.model.get("to"), syncNode: app.syncNode }).get("label"))))
		};
	},

	templateHelpers: {
		krist(number) {
			return Number(number).toLocaleString() + " KST";
		}
	},

	onAttach() {
		this.$("time").timeago();
	},

	onRender() {
		this.$("time").timeago();
	}
});