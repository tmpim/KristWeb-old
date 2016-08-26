import $ from "jquery";
import _ from "lodash";

import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import d3 from "d3";
import nv from "nvd3";

import app from "../../app";

import Radio from "backbone.radio";

let appChannel = Radio.channel("global");

export default LayoutView.extend({
	template: template,
	className: "panel",

	initialize() {
		this.loadData();

		appChannel.on("syncNode:changed", () => {
			if (!this.isDestroyed) this.loadData();
		});
	},

	loadData() {
		if (this.isDestroyed) return;

		let self = this;

		$.ajax(`${app.syncNode || "https://krist.ceriat.net"}/work/day`).done(data => {
			if (self.isDestroyed) return;

			self.work = _.map(data.work, (work, i) => { return { x: i, y: work }; });

			self.render();
		});
	},

	onRender() {
		let self = this;

		if (this.work) {
			nv.addGraph(() => {
				let work = self.work;
				let length = self.work.length;

				let chart = nv.models.lineChart()
					.showLegend(false)
					.useInteractiveGuideline(true)
					.interpolate("basis");

				chart.xAxis.axisLabel("Time")
					.tickFormat(d => {
						return (length - d) >= 60 ? (Math.floor((length - d) / 60)) + "h" : (length - d) <= 1 ? "now" : (length - d) + "m";
					});

				chart.yAxis.axisLabel("Work")
					.tickFormat(d => d.toLocaleString());

				d3.select("#network-chart")
					.datum([{
						values: work,
						key: "Work",
						color: "#3897d9"
					}])
					.call(chart);

				nv.utils.windowResize(chart.update);

				return chart;
			});
		}
	}
});