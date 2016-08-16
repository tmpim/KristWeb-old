import _ from "lodash";

import {LayoutView} from "backbone.marionette";
import template from "./recipient-container.hbs";

import app from "../app";

export default LayoutView.extend({
	template: template,
	tagName: "select",
	id: "recipient",

	initialize(options) {
		this.sendKristTo = options.sendKristTo;
	},

	templateHelpers() {
		return {
			wallets: app.wallets ? _.sortBy(app.wallets.toJSON(), "position") : null,
			friends: app.friends ? _.sortBy(app.friends.toJSON(), "position") : null
		};
	},

	onAttach() {
		this.$el.attr("tabindex", "2");

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
			createFilter: /^(?:[a-f0-9]{10}|k[a-z0-9]{9}|[a-z0-9]{1,64}\.kst)$/
		});

		if (this.sendKristTo) {
			this.$el[0].selectize.createItem(this.sendKristTo);
		}
	}
});