import {Model} from "backbone";
import LocalStorage from "backbone.localstorage";

import EncryptedLocalStorage from "../application/encrypted-local-storage";

export default Model.extend({
	defaults: {
		address: "",
		label: "",
		icon: "",
		isName: false,
		syncNode: "https://krist.ceriat.net"
	},

	localStorage: new LocalStorage("Friend", EncryptedLocalStorage)
});