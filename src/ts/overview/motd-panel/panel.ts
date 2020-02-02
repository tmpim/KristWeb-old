import $ from "jquery";
import moment from "moment";

import { View } from "backbone.marionette";
import template from "./template.hbs";

import app from "../../app";

import Radio from "backbone.radio";

let appChannel = Radio.channel("global");

export default View.extend({
  template,
  className: "panel",

  initialize() {
    appChannel.on("motd:changed", () => {
      if (!this.isDestroyed) this.render();
    });

    appChannel.on("krist:block", data => {
      if (this.isDestroyed) return;

      this.showHashrate = true;
      this.work = data.newWork;

      this.checkValue();
      this.render();
    });

    this.checkValue();

    $.ajax(`${app.syncNode || "https://krist.ceriat.net"}/blocks/last`).done(blockData => {
      if (this.isDestroyed || !blockData.ok) return;

      this.showHashrate = moment().isAfter(moment(blockData.block.time).subtract(15, "minutes"));

      $.ajax(`${app.syncNode || "https://krist.ceriat.net"}/work`).done(workData => {
        if (this.isDestroyed || !workData.ok) return;
        this.work = workData.work;
        this.render();
      });
    });
  },

  checkValue() {
    $.ajax(`${app.syncNode || "https://krist.ceriat.net"}/blocks/value`).done(data => {
      if (this.isDestroyed || !data.ok) return;

      this.blockValue = data.value;
      this.baseValue = data.base_value;

      this.render();
    });
  },

  templateContext: {
    motd() {
      if (app.motd) {
        return app.motd.motd;
      } else {
        return null;
      }
    },

    time() {
      if (app.motd) {
        return new Date(app.motd.set).toISOString();
      } else {
        return null;
      }
    },

    localise(number) {
      return Number(number).toLocaleString();
    },

    estimateHashrate(work) {
      const rate = 1 / (Number(work) / (Math.pow(256, 6)) * 60); // TODO: seconds per block and bytes per hash from /info
      if (rate === 0) return "0 H/s";

      const sizes = ["H", "KH", "MH", "GH", "TH"];
      const i = Math.floor(Math.log(rate) / Math.log(1000));
      return parseFloat((rate / Math.pow(1000, i)).toFixed(2)) + " " + sizes[i] + "/s";
    }
  },

  serializeData() {
    return {
      blockValue: this.blockValue || 0,
      baseValue: this.baseValue || 0,
      work: this.work || 0,
      showHashrate: this.showHashrate
    };
  },

  onAttach() {
    this.$el.find("#motd-set").timeago();
  },

  onRender() {
    this.$el.find("#motd-set").timeago();
  }
});