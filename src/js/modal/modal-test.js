import TestModalTemplate from "../modal/test-modal.hbs";
import TestModalButtons from "../modal/test-modal-buttons.hbs";

import Modal from "./modal";

import app from "../app.js";

export default Modal.extend({
	dialog: TestModalTemplate,
	buttons: TestModalButtons,

	title: "Test Modal",

	events: {
		"click .modal-make-another": "makeAnother",
		"click .modal-cool-loader": "coolLoader"
	},

	extraData: {
		test: "Super Modal"
	},

	makeAnother() {
		let TestModal2 = Modal.extend({
			dialog: "<b>This template</b> isn't precompiled so it may take a while to load",
			title: "Test Modal 2"
		});

		app.layout.modals.show(new TestModal2());
	},

	coolLoader() {
		this.$el.find(".modal-cool-loader").toggleClass("loading");
	}
});