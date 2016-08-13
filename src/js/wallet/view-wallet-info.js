import {ItemView} from "backbone.marionette";
import template from "./template-wallet-info.hbs";

export default ItemView.extend({
	template: template,
	className: "topBar-addressInfo",

	modelEvents: {
		"all": "render"
	},

	templateHelpers: {
		krist(krist) {
			return Number(krist).toLocaleString() + " KST";
		}
	}
});