import Clipboard from "clipboard";

import ExportWalletsModalTemplate from "./template.hbs";
import ExportWalletsModalButtons from "./buttons.hbs";

import Modal from "./../modal";

import saveAs from "file-saver";

export default Modal.extend({
	dialog: ExportWalletsModalTemplate,
	buttons: ExportWalletsModalButtons,

	title: "Export Wallets",

	onShow() {
		if (this.shown) return;
		this.shown = true;

		let data = {
			salt: localStorage.salt,
			tester: localStorage.tester,
			wallets: {},
			friends: {}
		};

		for (let i = 0; i < localStorage.length; i++) {
			let key = localStorage.key(i);

			if (key.startsWith("Wallet")) {
				data.wallets[key] = localStorage.getItem(key);
			} else if (key.startsWith("Friend")) {
				data.friends[key] = localStorage.getItem(key);
			}
		}

		let code = window.btoa(JSON.stringify(data));
		this.$("#wallets-code").text(code);
		this.$("#wallets-code-size").text((code.length / 1024).toFixed(1));

		this.$("#wallets-code-save").click(() => { 
			const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
			saveAs(blob, `KristWeb-export-${new Date().getTime()}.txt`);
			this.triggerSubmit();
		});

		setTimeout(() => {
			new Clipboard("#wallets-code-copy-to-clipboard");
		}, 200);
	}
});