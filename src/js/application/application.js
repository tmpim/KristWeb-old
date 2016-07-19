import $ from "jquery";
import _ from "lodash";
import {Application} from "backbone.marionette";
import LayoutView from "./layout-view";

import SidebarService from "../sidebar/service";

import Address from "../address/model";

import WalletCollection from "../wallet/collection";
import WalletChooserView from "../wallet/chooser-view";

import Router from "../router";
import Radio from "backbone.radio";

import NProgress from "nprogress";

import Modal from "../modal/modal";

let walletChannel = Radio.channel("wallet");

export default Application.extend({
	initialize() {
		_.extend(NProgress.settings, {
			showSpinner: false
		});

		this.layout = new LayoutView();
		this.layout.render();

		SidebarService.setup({
			container: this.layout.sidebar
		});

		this.router = new Router({
			container: this.layout.content
		});
	},

	error(title, text) {
		this.layout.modals.show(new (Modal.extend({
			title: title,
			text: text
		}))());
	},

	passwordReady() {
		this.wallets = new WalletCollection();
		this.wallets.fetch();

		if (this.wallets.length > 0) {
			this.switchWallet(this.wallets.at(0));
		}

		let walletChooserView = new WalletChooserView({
			collection: this.wallets,
			container: this.layout.walletList
		});

		this.layout.walletList.show(walletChooserView);
	},

	switchWallet(wallet) {
		NProgress.start();

		let self = this;
		this.activeWallet = wallet;

		walletChannel.trigger("wallet:activeChanging");

		let syncNode = wallet.get("syncNode") || "https://krist.ceriat.net";
		this.syncNode = syncNode;

		$.ajax(syncNode + "/login", {
			method: "POST",
			data: {
				privatekey: wallet.get("masterkey")
			}
		}).done((data) => {
			if (!data || !data.ok) {
				NProgress.done();
				return this.error("Unknown Error", "Server returned an unknown error: " + (data.error || ""));
			}

			if (!data.authed) {
				NProgress.done();
				return this.error("Authentication Failed", "You are not the owner of this wallet.");
			}

			NProgress.set(0.5);

			let address = new Address({
				address: data.address
			});

			address.fetch({
				success(model, response) {
					if (!response || !response.ok) {
						NProgress.done();
						return self.error("Error", "Server returned an error: " + (response.error || ""));
					}

					self.activeWallet.boundAddress = model;

					walletChannel.trigger("wallet:activeChanged");

					NProgress.done();
				},

				error(model, response) {
					NProgress.done();
					return self.error("Error", "Server returned an error: " + response);
				}
			});
		});
	}
});