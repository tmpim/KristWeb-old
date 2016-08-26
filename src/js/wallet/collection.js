import {Collection} from "backbone";
import LocalStorage from "backbone.localstorage";

import app from "../app";

import WalletModel from "./model";
import EncryptedLocalStorage from "../application/encrypted-local-storage";

export default Collection.extend({
	model: WalletModel,

	localStorage: new LocalStorage("Wallet", EncryptedLocalStorage),

	viewComparator: "position"
});