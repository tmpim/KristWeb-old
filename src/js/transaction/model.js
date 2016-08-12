import _ from "lodash";

import {Model} from "backbone";

import app from "../app";

export default Model.extend({
	defaults: {
		from: "",
		to: "",
		value: 0,
		time: "",
		name: "",
		metadata: ""
	},

	idAttribute: "id",

	urlRoot() {
		return (app.syncNode || "https://krist.ceriat.net") + "/transactions";
	},

	parse(data) {
		if (_.isObject(data.transaction)) {
			return data.transaction;
		}

		return data;
	}
});