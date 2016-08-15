import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import Radio from "backbone.radio";

let appChannel = Radio.channel("global");

export default LayoutView.extend({
	template: template,
	className: "panel"
});