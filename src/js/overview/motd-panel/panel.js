import $ from "jquery";

import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import app from "../../app";

import Radio from "backbone.radio";

let appChannel = Radio.channel("global");

export default LayoutView.extend({
	template: template,
	className: "panel",

	initialize() {
		appChannel.on("motd:changed", () => {
			if (this.isDestroyed) return;

			this.render();
		});

		$.ajax(`${app.syncNode || "https://krist.ceriat.net"}/blocks/value`).done(data => {
			if (this.isDestroyed) return;

			this.blockValue = data.value;
			this.baseValue = data.base_value;

			this.render();
		});
	},

	templateHelpers: {
		motd() {
			if (app.motd) {
				return app.motd.motd;
			} else {
				return null;
			}
		},

		time() {
			if (app.motd) {
				return new Date(app.motd.set).toISOString();
			} else {
				return null;
			}
		},

		localise(number) {
			return Number(number).toLocaleString();
		}
	},

	serializeData() {
		return {
			blockValue: this.blockValue || 0,
			baseValue: this.baseValue || 0
		};
	},

	onAttach() {
		this.$el.find("#motd-set").timeago();
	},

	onRender() {
		this.$el.find("#motd-set").timeago();
	}
});