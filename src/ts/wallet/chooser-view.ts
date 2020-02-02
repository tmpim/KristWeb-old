import { CollectionView } from "backbone.marionette";
import WalletView from "./view";

import Sortable from "sortablejs";

import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

export default CollectionView.extend({
  initialize(options = {}) {
    this.container = options.container;

    walletChannel.on("wallet:activeChanged", () => {
      this.render();
    });

    walletChannel.on("wallet:activeChanging", () => {
      this.render();
    });

    walletChannel.on("wallet:activeRemoved", () => {
      this.render();
    });

    walletChannel.on("wallet:changeFailed", () => {
      this.render();
    });
  },

  childView: WalletView,

  viewComparator: "position",

  collectionEvents: {
    sort: "render"
  },

  initSortable() {
    let self = this;

    let sortable = new Sortable(this.el, {
      scroll: true,

      onEnd() {
        let order = sortable.toArray();

        for (let i = 0; i < order.length; i++) {
          self.collection.get(order[i]).set("position", i);
          self.collection.get(order[i]).save();
        }
      }
    });

    this.sortable = sortable;
  },

  onAttach() {
    this.initSortable();
  },

  onRender() {
    this.initSortable();
  }
});