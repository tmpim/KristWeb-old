import {LayoutView} from "backbone.marionette";
import template from "./pay-template.hbs";

import Transaction from "./model";

import AlertView from "../alert/view";
import GetErrorText from "../utils/errors";

import NProgress from "nprogress";

import app from "../app";

export default LayoutView.extend({
	template: template,
	id: "make-transaction",

	initialize(options) {
	}
});