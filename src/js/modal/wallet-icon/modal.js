import WalletIconTemplate from "./template.hbs";
import WalletIconButtons from "./buttons.hbs";

import Modal from "./../modal";

import app from "../../app.js";
import NProgress from "nprogress";

export default Modal.extend({
	dialog: WalletIconTemplate,
	buttons: WalletIconButtons,

	title: "Wallet Icon",

	events: {
		"click #wallet-icon-choose-another": "chooseAnother",
		"click .modal-remove": "removeIcon"
	},

	onShow() {
		this.$el.find("#wallet-icon-crop").hide();

		this.$el.find("#wallet-icon-file").on("change", () => {
			NProgress.start();

			let input = this.$el.find("#wallet-icon-file")[0];
			if (!input.files || input.files.length <= 0) return;

			this.$el.find("#wallet-icon-file").addClass("loading").prop("disabled", true);

			let file = input.files[0];
			let fr = new FileReader();

			fr.onprogress = (e) => {
				NProgress.set(e.loaded / e.total);
			};

			fr.onload = (e) => {
				NProgress.done();

				this.$el.find(".modal-remove").fadeOut();
				this.$el.find("#wallet-icon-file").removeClass("loading");

				this.$el.find("#wallet-icon-upload").slideUp(() => {
					this.$el.find("#wallet-icon-crop").slideDown();
				});

				this.$el.find("#wallet-icon-preview").attr("src", e.target.result).cropper({
					minContainerWidth: 470,
					minContainerHeight: 200,
					aspectRatio: 1,
					preview: this.$("#wallet-icon-small-preview"),
					viewMode: 1
				});
			};

			fr.readAsDataURL(file);
		});
	},

	chooseAnother() {
		this.$el.find(".modal-remove").fadeIn();
		this.$el.find("#wallet-icon-crop").slideUp(() => {
			let fileInput = this.$el.find("#wallet-icon-file");
			fileInput.prop("disabled", false);
			fileInput.replaceWith(fileInput.clone(true));

			this.$el.find("#wallet-icon-upload").slideDown();
			this.$el.find("#wallet-icon-preview").cropper("destroy");
		});
	},

	beforeSubmit() {
		this.$el.find(".modal-submit").addClass("loading").prop("disabled", true);
	},

	submit() {
		if (this.success) {
			NProgress.start();

			let img = this.$el.find("#wallet-icon-preview").cropper("getCroppedCanvas");

			let c = document.createElement("canvas");
			let ctx = c.getContext("2d");

			c.width = 38;
			c.height = 38;

			if (img.width > 128 || img.height > 128) {
				let oc = document.createElement("canvas");
				let octx = oc.getContext("2d");

				oc.width = img.width * 0.5;
				oc.height = img.height * 0.5;
				octx.drawImage(img, 0, 0, oc.width, oc.height);
				octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);
				ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5, 0, 0, c.width, c.height);
			} else {
				ctx.drawImage(img, 0, 0, c.width, c.height);
			}

			this.success(c.toDataURL());

			NProgress.done();
		}
	},

	removeIcon() {
		if (this.removeIcon) {
			this.removeIcon();
		}

		this.destroy();
	}
});