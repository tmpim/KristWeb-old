import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import app from "../../app.js";

import Radio from "backbone.radio";

let appChannel = Radio.channel("global");

export default LayoutView.extend({
	template: template,
	className: "panel",

	initialize() {
		appChannel.on("motd:changed", () => {
			if (this.isDestroyed) {
				return;
			}

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
		}
	},

	onAttach() {
		this.$el.find("#motd-set").timeago();
	},

	onRender() {
		this.$el.find("#motd-set").timeago();
	}
});