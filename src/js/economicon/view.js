import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import NetworkFooter from "../network-footer/view";

export default LayoutView.extend({
	template: template,
	className: "economicon",

	regions: {
		networkFooter: "#network-footer"
	},

	onRender() {
		this.networkFooter.show(new NetworkFooter());
	}
});