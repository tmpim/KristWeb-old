import _ from "lodash";

import {Model} from "backbone";

import app from "../app";

export default Model.extend({
	defaults: {
		address: "",
		hash: "",
		short_hash: "",
		value: 0,
		time: "",
		difficulty: 0
	},

	idAttribute: "height",

	urlRoot() {
		return (app.syncNode || "https://krist.ceriat.net") + "/blocks";
	},

	parse(data) {
		if (_.isObject(data.block)) {
			return data.block;
		}

		return data;
	}
});