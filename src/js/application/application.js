import $ from "jquery";
import _ from "lodash";
import {Application} from "backbone.marionette";
import LayoutView from "./layout-view";

import SidebarService from "../sidebar/service";
import WebsocketService from "./websockets";

import Address from "../address/model";

import WalletCollection from "../wallet/collection";
import WalletChooserView from "../wallet/chooser-view";
import WalletInfoView from "../wallet/view-wallet-info";

import Router from "../router";
import Radio from "backbone.radio";

import NProgress from "nprogress";

import Modal from "../modal/modal";

let walletChannel = Radio.channel("wallet");
let appChannel = Radio.channel("global");

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

		appChannel.on("syncNode:changed", syncNode => {
			this.syncNodeChanged(syncNode);
		});
	},

	error(title, text) {
		this.layout.modals.show(new (Modal.extend({
			title: title,
			dialog: text
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

		walletChannel.trigger("wallet:activeChanging", wallet);

		let syncNode = wallet.get("syncNode") || "https://krist.ceriat.net";
		let didSyncNodeChange = false;

		if (this.syncNode !== syncNode) {
			didSyncNodeChange = true;
			appChannel.trigger("syncNode:changed", syncNode);
		}

		this.syncNode = syncNode;

		$.ajax(syncNode + "/login", {
			method: "POST",
			data: {
				privatekey: wallet.get("masterkey")
			}
		}).done(data => {
			if (!data || !data.ok) {
				NProgress.done();
				console.error(data);
				this.activeWallet = null;
				walletChannel.trigger("wallet:changeFailed", wallet, didSyncNodeChange);
				return this.error("Unknown Error", `Server returned an unknown error: ${data.error || ""}`);
			}

			if (!data.authed) {
				NProgress.done();
				this.activeWallet = null;
				walletChannel.trigger("wallet:changeFailed", wallet, didSyncNodeChange);
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
						console.error(response);
						self.activeWallet = null;
						walletChannel.trigger("wallet:changeFailed", wallet, didSyncNodeChange);
						return self.error("Error", `Server returned an error: ${response.error || ""}`);
					}

					self.activeWallet.boundAddress = model;

					walletChannel.trigger("wallet:activeChanged", wallet, didSyncNodeChange);
					self.layout.topBarAddressInfo.show(new WalletInfoView({
						model: model
					}));

					NProgress.done();
				},

				error(model, response) {
					NProgress.done();
					console.error(response);
					self.activeWallet = null;
					walletChannel.trigger("wallet:changeFailed", wallet, didSyncNodeChange);
					return self.error("Error", `Server returned an error: ${response}`);
				}
			});
		}).fail((jqXHR, textStatus, error) => {
			NProgress.done();

			return this.error("Unknown Error", `Failed to connect to the sync node: ${error}`);
		});
	},

	syncNodeChanged(syncNode) {
		let self = this;

		$.ajax(syncNode + "/motd").done(data => {
			self.motd = data;

			appChannel.trigger("motd:changed", data);
		});

		WebsocketService.request("connect");
	}
});