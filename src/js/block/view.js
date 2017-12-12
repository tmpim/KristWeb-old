import $ from "jquery";

import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import Block from "./model";
import BlockOverview from "./overview/view";

import NetworkFooter from "../network-footer/view";

import AlertView from "../alert/view";
import GetErrorText from "../utils/errors";

import NProgress from "nprogress";

import app from "../app";

export default LayoutView.extend({
	template: template,
	className: "block",

	regions: {
		overview: "#overview",
		networkFooter: "#network-footer"
	},

	ui: {
		gotoBlock: "#goto-block",
		gotoBlockGo: "#goto-block-go"
	},

	triggers: {
		"click @ui.gotoBlockGo": "goto:block"
	},

	initialize(options) {
		this.block = options.block;

		NProgress.start();

		let self = this;

		new Block({ height: this.block }).fetch({
			success(model, response) {
				if (!response || !response.ok) {
					NProgress.done();
					console.error(response);

					return self.overview.show(new AlertView({
						title: "Error",
						text: GetErrorText(response),
						style: "red"
					}));
				}

				self.overview.show(new BlockOverview({
					model: model
				}));

				NProgress.done();
			},

			error(response) {
				NProgress.done();
				console.error(response);

				return self.overview.show(new AlertView({
					title: "Error",
					text: GetErrorText(response),
					style: "red"
				}));
			}
		});
	},

	onShow() {
		this.ui.gotoBlock.val(this.block);
	},

	onRender() {
		this.networkFooter.show(new NetworkFooter());
	},

	onGotoBlock() {
		app.router.navigate(`block/${encodeURIComponent(this.ui.gotoBlock.val())}`, { trigger: true });
	}
});