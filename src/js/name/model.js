import _ from "lodash";

import {Model} from "backbone";

import app from "../app";

export default Model.extend({
	defaults: {
		name: "",
		owner: "",
		registered: 0,
		updated: "",
		a: ""
	},

	idAttribute: "name",

	urlRoot() {
		return (app.syncNode || "https://krist.ceriat.net") + "/names";
	},

	parse(data) {
		if (_.isObject(data.name)) {
			return data.name;
		}

		return data;
	}
});