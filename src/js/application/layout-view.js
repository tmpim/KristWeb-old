import {LayoutView} from "backbone.marionette";
import template from "./layout-template.hbs";
import Backbone from "backbone";

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
		walletChooser: "#wallet-chooser"
	},

	ui: {
		pageContainer: "#page-container",
		sidebarOpener: "#sidebar-opener",
		sidebarDim: "#sidebar-dim",
		walletChooserButton: "#wallet-chooser-button",
		walletChooser: "#wallet-chooser",
		topBar: ".topBar"
	},

	triggers: {
		"click @ui.sidebarOpener": "click:sidebarOpener",
		"click @ui.sidebarDim": "click:sidebarDim",
		"click @ui.walletChooserButton": "toggle:walletChooser"
	},

	onClickSidebarOpener() {
		this.ui.pageContainer.toggleClass("sidebar-open");
	},

	onClickSidebarDim() {
		this.ui.pageContainer.removeClass("sidebar-open");
	},

	onToggleWalletChooser() {
		if (this.ui.walletChooser.hasClass("shown")) {
			this.ui.walletChooser.removeClass("shown");
			this.ui.walletChooser.addClass("hidden");
		} else {
			this.ui.walletChooser.removeClass("hidden");
			this.ui.walletChooser.addClass("shown");
		}
	},

	onRender() {
		this.ui.walletChooser.css("top", this.ui.topBar.height() + "px");

		this.$(window).resize(() => {
			this.ui.walletChooser.css("top", this.ui.topBar.height() + "px");
		});
	}
});