import $ from "jquery";
import _ from "lodash";
import Radio from "backbone.radio";
import nprogress from "nprogress";
import {Application} from "backbone.marionette";
import LayoutView from "./layout-view";

import SidebarService from "../sidebar/service";

import WalletCollection from "../wallet/collection";
import WalletChooserView from "../wallet/chooser-view";

import Router from "../router";

import app from "../app";

nprogress.configure({
	showSpinner: false
});

export default Application.extend({
	initialize() {
		this.$body = $(document.body);
		this.layout = new LayoutView();
		this.layout.render();

		SidebarService.setup({
			container: this.layout.sidebar
		});

		this.router = new Router({
			container: this.layout.content
		});
	},

	onBeforeEnterRoute() {
		this.transitioning = true;

		_.defer(() => {
			if (this.transitioning) {
				nprogress.start();
			}
		});
	},

	onEnterRoute() {
		this.transitioning = false;
		this.$body.scrollTop(0);
		nprogress.done();
	},

	onErrorRoute() {
		this.transitioning = false;
		nprogress.done(true);
	},

	passwordReady() {
		this.wallets = new WalletCollection();
		app.wallets.fetch();

		let walletChooserView = new WalletChooserView({
			collection: this.wallets,
			container: this.layout.walletChooser
		});

		this.layout.walletChooser.show(walletChooserView);
	}
});