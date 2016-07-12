import $ from "jquery";
import _ from "lodash";
import {Application} from "backbone.marionette";
import LayoutView from "./layout-view";

import SidebarService from "../sidebar/service";

import WalletCollection from "../wallet/collection";
import WalletChooserView from "../wallet/chooser-view";

import Router from "../router";

import app from "../app";

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

	passwordReady() {
		this.wallets = new WalletCollection();
		app.wallets.fetch();

		let walletChooserView = new WalletChooserView({
			collection: this.wallets,
			container: this.layout.walletList
		});

		this.layout.walletList.show(walletChooserView);
	}
});