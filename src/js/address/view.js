import $ from "jquery";

import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import Address from "./model";
import AddressOverview from "./overview/view";

import AlertView from "../alert/view";
import GetErrorText from "../utils/errors";

import NProgress from "nprogress";

import app from "../app";

export default LayoutView.extend({
	template: template,
	className: "address",

	regions: {
		overview: "#overview"
	},

	initialize(options) {
		this.address = options.address;

		NProgress.start();

		let self = this;

		new Address({ address: this.address }).fetch({
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

				self.overview.show(new AddressOverview({
					model: model
				}));

				$.ajax(`${app.syncNode || "https://krist.ceriat.net"}/addresses/${encodeURIComponent(model.get("address"))}/names`).done(data => {
					model.set("nameCount", data.total || 0);

					NProgress.done();
				}).fail(NProgress.done);

				NProgress.set(0.75);
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
	}
});