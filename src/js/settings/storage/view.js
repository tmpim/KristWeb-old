import _ from "lodash";

import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

export default LayoutView.extend({
	template: template,
	id: "settings-storage",

	initialize() {
		this.total = 0;
		this.objects = [];
	},

	templateHelpers: {
		storageUsed(i) {
			return `${(Number(i) || 0).toFixed(2)} KB`;
		},

		storagePercent(i) {
			return ((Number(i) || 0) / 5120) * 100;
		},

		storagePercentBreakdown(i, total) {
			return ((Number(i) || 0) / (total || 0)) * 100;
		},

		toFixed(a, b) {
			return Number(a).toFixed(b);
		}
	},

	serializeData() {
		return {
			total: this.total,
			objects: this.objects
		};
	},

	onBeforeRender() {
		for (let x in localStorage) {
			//noinspection JSUnfilteredForInLoop
			this.total += ((localStorage[x].length * 2) / 1024) || 0;
			this.objects.push({
				//noinspection JSUnfilteredForInLoop
				name: x.substr(0, 50),
				//noinspection JSUnfilteredForInLoop
				size: (localStorage[x].length * 2) / 1024
			});
		}

		this.objects = _.reverse(_.sortBy(this.objects, "size"));
	}
});