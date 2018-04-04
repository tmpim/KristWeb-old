import _ from "lodash";

import PageableCollection from "backbone.paginator";

import Transaction from "./model";
import app from "../app";

export default PageableCollection.extend({
	model: Transaction,

	initialize(models, options) {
		this.address = options ? options.address : null;
		this.excludeMined = options ? options.excludeMined : null;
		this.queryParams.excludeMined = () => this.excludeMined || null;
	},

	url() {
		if (this.address) {
			return (app.syncNode || "https://krist.ceriat.net")
				+ "/addresses/"
				+ encodeURIComponent(this.address || app.activeWallet.boundAddress.get("address"))
				+ "/transactions";
		} else {
			return (app.syncNode || "https://krist.ceriat.net")
				+ "/transactions/latest";
		}
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