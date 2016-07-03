import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import app from "../app.js";

export default LayoutView.extend({
	template: template,
	className: "overview"
});