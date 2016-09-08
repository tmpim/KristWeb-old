import _ from "lodash";

import {Collection} from "backbone";

import Address from "../../address/model";
import app from "../../app";

export default Collection.extend({
	model: Address,

	url() {
		return (app.syncNode || "https://krist.ceriat.net") + "/addresses/rich";
	},

	parse(data) {
		if (_.isObject(data.addresses)) {
			return data.addresses;
		}

		return data;
	}
});