import _ from "lodash";

import PageableCollection from "backbone.paginator";

import Transaction from "./model";
import app from "../app";

export default PageableCollection.extend({
	model: Transaction,

	initialize(models, options) {
		this.address = options ? options.address : null;
	},

	url() {
		return (app.syncNode || "https://krist.ceriat.net") + "/addresses/" + (this.address || app.activeWallet.boundAddress.get("address")) + "/transactions";
	},

	parseRecords(data) {
		if (_.isObject(data.transactions)) {
			return data.transactions;
		}

		return data;
	},

	parseState(data) {
		return {
			totalRecords: data.total
		};
	},

	state: {
		firstPage: 0,
		pageSize: 15
	},

	queryParams: {
		pageSize: "limit",
		offset() { return this.state.currentPage * this.state.pageSize; },
		currentPage: null,
		totalPages: null,
		totalRecords: null
	}
});