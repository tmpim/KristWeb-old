import $ from "jquery";
import _ from "lodash";

import {ItemView} from "backbone.marionette";
import template from "./template.hbs";

import krist from "../../utils/krist";

export default ItemView.extend({
	template: template,
	class: "commonmeta-view",

	modelEvents: {
		"all": "render"
	},

	serializeData() {
		return {
			raw: this.model.get("metadata"),
			commonMeta: _.map(_.toPairs(krist.parseCommonMeta(this.model.get("metadata"))), o => {
				return {
					key: o[0],
					value: o[1]
				};
			})
		};
	},

	onRender() {
		this.$("#transaction-time").timeago();

		this.$(".commonmeta-tab").click(function() {
			const $tab = $(this);
			const $view = $tab.closest(".commonmeta-view");

			const tabName = $tab.attr("data-tab");
			const pageClass = ".commonmeta-page.commonmeta-" + tabName;

			$view.find(".active").removeClass("active");

			$tab.addClass("active");
			$view.find(pageClass).addClass("active");
		});
	}
});