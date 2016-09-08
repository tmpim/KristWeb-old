import _ from "lodash";

import {Collection} from "backbone";

import Transaction from "../../transaction/model";
import app from "../../app";

export default Collection.extend({
	model: Transaction,

	initialize(models, options) {
		this.address = options ? options.address : null;
	},

	url() {
		return (app.syncNode || "https://krist.ceriat.net") + "/addresses/" + this.address + "/transactions?limit=5";
	},

	parse(data) {
		if (_.isObject(data.transactions)) {
			return data.transactions;
		}

		return data;
	}
});