import $ from "jquery";

import { View } from "backbone.marionette";
import template from "./template.hbs";

import Address from "./model";
import AddressOverview from "./overview/view";

import ActivityPanel from "./activity-panel/panel";
import ActivityCollection from "./activity-panel/activity-collection";

import NamesPanel from "./names-panel/panel";
import NamesCollection from "./names-panel/names-collection";

import NetworkFooter from "../network-footer/view";

import AlertView from "../alert/view";
import GetErrorText from "../utils/errors";

import NProgress from "nprogress";

import app from "../app";

export default View.extend({
  template,
  className: "address",

  regions: {
    overview: "#overview",
    activityPanel: "#activity-panel",
    namesPanel: "#names-panel",
    networkFooter: "#network-footer"
  },

  initialize(options) {
    this.address = options.address;

    NProgress.start();

    let self = this;

    new Address({ address: this.address }).fetch({
      success(model, response) {
        if (!response || !response.ok) {
          NProgress.done();
          console.error(response);

          return self.overview.show(new AlertView({
            title: "Error",
            text: GetErrorText(response),
            style: "red"
          }));
        }

        self.overviewModel = model;

        $.ajax(`${app.syncNode || "https://krist.ceriat.net"}/addresses/${encodeURIComponent(model.get("address"))}/names`).done(data => {
          model.set("nameCount", data.total || 0);

          NProgress.done();
        }).fail(NProgress.done);

        self.activityCollection = new ActivityCollection(null, {
          address: model.get("address")
        });

        self.namesCollection = new NamesCollection(null, {
          address: model.get("address")
        });

        self.activityCollectionFetched = false;

        self.activityCollection.fetch({
          success() {
            self.activityCollectionFetched = true;

            if (!self.isDestroyed) self.render();
          }
        });

        self.namesCollectionFetched = false;

        self.namesCollection.fetch({
          success() {
            self.namesCollectionFetched = true;

            if (!self.isDestroyed) self.render();
          }
        });

        NProgress.set(0.75);
      },

      error(response) {
        NProgress.done();
        console.error(response);

        return self.overview.show(new AlertView({
          title: "Error",
          text: GetErrorText(response),
          style: "red"
        }));
      }
    });
  },

  onRender() {
    if (this.activityCollection && this.activityCollectionFetched) {
      this.activityPanel.show(new ActivityPanel({
        collection: this.activityCollection,
        address: this.address
      }));
    }

    if (this.namesCollection && this.namesCollectionFetched) {
      this.namesPanel.show(new NamesPanel({
        collection: this.namesCollection,
        address: this.address
      }));
    }

    if (this.overviewModel) {
      this.overview.show(new AddressOverview({
        model: this.overviewModel
      }));
    }

    this.networkFooter.show(new NetworkFooter());
  }
});