import _ from "lodash";

import {Model} from "backbone";
import LocalStorage from "backbone.localstorage";

import app from "../app";

export default Model.extend({
	defaults: {
		address: "",
		balance: 0,
		firstseen: ""
	},

	idAttribute: "address",

	urlRoot() {
		return (app.syncNode || "https://krist.ceriat.net") + "/addresses";
	},

	parse(data) {
		if (_.isObject(data.address)) {
			return data.address;
		}

		return data;
	}
});