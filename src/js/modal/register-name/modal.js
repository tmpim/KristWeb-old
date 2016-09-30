import $ from "jquery";

import RegisterNameModalTemplate from "./template.hbs";
import RegisterNameModalButtons from "./buttons.hbs";

import Modal from "./../modal";

import NProgress from "nprogress";
import GetErrorText from "../../utils/errors";

import app from "../../app";

export default Modal.extend({
	dialog: RegisterNameModalTemplate,
	buttons: RegisterNameModalButtons,

	title: "Register Name",

	label(text, cls) {
		let nameLabel = $("#name-label");

		nameLabel.text(text);
		nameLabel.removeClass("text-red");
		nameLabel.removeClass("text-green");
		nameLabel.removeClass("label-hidden");

		if (cls) nameLabel.addClass(cls);
	},

	onShow() {
		let self = this;
		let timer;

		$("#name").on("keyup", function() {
			clearTimeout(timer);
			timer = setTimeout(function() {
				$.get(app.syncNode + "/names/" + encodeURIComponent($("#name").val())).done(data => {
					NProgress.done();

					if (data.ok && data.name) {
						return self.label("Name not available.", "text-red");
					} else {
						if (!data.ok && data.error === "name_not_found") {
							return self.label("Name available!", "text-green");
						}

						self.label("Invalid name.", "label-red");
					}
				});
			}, 500);

			self.label("Checking availability...");
		});
	},

	submit() {
		NProgress.start();

		let name = $("#name").val();

		$.ajax(app.syncNode + "/names/" + encodeURIComponent(name), {
			method: "POST",
			data: {
				privatekey: app.activeWallet.get("masterkey")
			}
		}).done(data => {
			NProgress.done();

			if (!data || !data.ok) {
				console.error(data);
				return app.error("Unknown Error", `Server returned an error: ${GetErrorText(data)}`);
			}

			app.router.navigate("/name/" + encodeURIComponent(name), true);
		}).fail((jqXHR, textStatus, error) => {
			NProgress.done();

			return app.error("Unknown Error", `Failed to connect to the sync node: ${GetErrorText(error)}`);
		});
	}
});