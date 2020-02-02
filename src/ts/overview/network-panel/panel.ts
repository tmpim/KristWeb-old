import $ from "jquery";
import _ from "lodash";

import { View } from "backbone.marionette";
import template from "./template.hbs";

import d3 from "d3";
import nv from "nvd3";

import app from "../../app";

import Radio from "backbone.radio";

let appChannel = Radio.channel("global");

const scaleMap = {
  "linear": d3.scale.linear(),
  "log2": d3.scale.log().base(2),
  "log10": d3.scale.log().base(10)
};

export default View.extend({
  template,
  className: "panel",

  initialize() {
    this.loadData();

    appChannel.on("syncNode:changed", () => {
      if (!this.isDestroyed) this.loadData();
    });

    appChannel.on("krist:block", () => {
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

  templateContext() {
    return {
      scale: this.scale || "linear"
    };
  },

  onRender() {
    let self = this;

    this.$("#network-chart-scale").selectize({
      onChange() {
        self.scale = self.$("#network-chart-scale").val();
        self.render();
      }
    });

    if (this.work) {
      nv.addGraph(() => {
        let work = self.work;
        let length = self.work.length;

        let chart = nv.models.lineChart()
          .showLegend(false)
          .useInteractiveGuideline(true)
          .interpolate("basis")
          .height(256);

        chart.xAxis.axisLabel("Time")
          .tickFormat(d => (length - d) >= 60 ? (Math.floor((length - d) / 60)) + "h" : (length - d) <= 1 ? "now" : (length - d) + "m");

        chart.yAxis.axisLabel("Work")
          .tickFormat(d => d.toLocaleString());

        if (self.scale && self.scale !== "linear") chart.yScale(scaleMap[self.scale]);
        chart.forceY([500, 100000]);

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