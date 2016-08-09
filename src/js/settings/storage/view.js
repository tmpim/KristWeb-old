import $ from "jquery";

import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

export default LayoutView.extend({
	template: template,
	className: "storage",

	templateHelpers: {
		storageUsed() {
			return `${(this.total || 0).toFixed(2)} KB`;
		},

		storagePercent() {
			return ((this.total || 0) / 5120) * 100;
		},

		toFixed(a, b) {
			return Number(a).toFixed(b);
		}
	},

	serializeData() {
		return {
			total: this.total
		};
	},

	onBeforeRender() {
		let total = 0;

		for (var x in localStorage) {
			total += (localStorage[x].length * 2) / 1024;
		}

		this.total = total;
	}
});