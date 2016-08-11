import _ from "lodash";

import {Model} from "backbone";
import LocalStorage from "backbone.localstorage";

import app from "../app";
import EncryptedLocalStorage from "../application/encrypted-local-storage";

export default Model.extend({
	defaults: {
		address: "",
		label: "",
		icon: "",
		syncNode: "https://krist.ceriat.net"
	},

	localStorage: new LocalStorage("Friend", EncryptedLocalStorage)
});