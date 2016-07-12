import {LayoutView} from "backbone.marionette";
import template from "./layout-template.hbs";
import Backbone from "backbone";

import AddWalletModel from "../modal/add-wallet/modal";

export default LayoutView.extend({
	el: "#app",
	template: template,

	regions: {
		content: "#app-content",
		sidebar: "#sidebar",
		modals: {
			selector: "#modalsContainer",
			regionClass: Backbone.Marionette.Modals
		},
		walletChooserContainer: "#wallet-chooser-container",
		walletChooser: "#wallet-chooser",
		walletList: "#wallet-list"
	},

	ui: {
		pageContainer: "#page-container",
		sidebarOpener: "#sidebar-opener",
		sidebarContent: "#sidebar-content",
		sidebar: "#sidebar",
		sidebarDim: "#sidebar-dim",
		walletChooserButton: "#wallet-chooser-button",
		walletChooserContainer: "#wallet-chooser-container",
		walletChooser: "#wallet-chooser",
		walletChooserAddWallet: "#wallet-chooser-add-wallet",
		topBar: ".topBar"
	},

	triggers: {
		"click @ui.sidebarOpener": "click:sidebarOpener",
		"click @ui.sidebarDim": "click:sidebarDim",
		"click @ui.walletChooserButton": "toggle:walletChooser",
		"click @ui.walletChooserAddWallet": "add:wallet"
	},

	onClickSidebarOpener() {
		this.ui.pageContainer.toggleClass("sidebar-open");
	},

	onClickSidebarDim() {
		this.ui.pageContainer.removeClass("sidebar-open");
	},

	onToggleWalletChooser() {
		if (this.ui.walletChooserContainer.hasClass("shown")) {
			this.ui.walletChooserContainer.removeClass("shown");
			this.ui.walletChooserContainer.addClass("hidden");
		} else {
			this.ui.walletChooserContainer.removeClass("hidden");
			this.ui.walletChooserContainer.addClass("shown");
		}
	},

	onRender() {
		this.ui.walletChooserContainer.css("top", this.ui.topBar.height() + "px");

		this.$(window).resize(() => {
			this.ui.walletChooserContainer.css("top", this.ui.topBar.height() + "px");
		});

		this.ui.walletChooser.mCustomScrollbar({
			scrollInertia: 500
		});

		setTimeout((() => {
			this.ui.sidebar.mCustomScrollbar({
				scrollInertia: 500,
				theme: "dark"
			});
		}).bind(this), 1000);
	},

	onAddWallet() {
		this.modals.show(new (AddWalletModel.extend({
		}))());
	}
});