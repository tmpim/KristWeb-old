import _ from "lodash";

import {LayoutView} from "backbone.marionette";
import template from "./recipient-container.hbs";

import app from "../app";

export default LayoutView.extend({
	template: template,
	tagName: "select",

	templateHelpers() {
		return {
			wallets: app.wallets ? _.sortBy(app.wallets.toJSON(), "position") : null,
			friends: app.friends ? _.sortBy(app.friends.toJSON(), "position") : null
		};
	},

	onAttach() {
		this.$el.selectize({
			plugins: {
				"dropdown_header": {
					title: "Press backspace to enter a custom address."
				}
			},
			create: true,
			persist: false,
			closeAfterSelect: true,
			placeholder: "Recipient",
			createFilter: /^(?:[a-f0-9]{10}|k[a-z0-9]{9})$/
		});
	}
});