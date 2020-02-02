import { View } from "backbone.marionette";
import template from "./list-template.hbs";

import Address from "../address/model";
import TransactionCollection from "./collection-paginated";

import TransactionListView from "./list-collectionview";
import WalletOverview from "../overview/wallet-overview/view";
import PaginationView from "../paginator/paginator";

import NetworkFooter from "../network-footer/view";

import AlertView from "../alert/view";
import GetErrorText from "../utils/errors";

import app from "../app";

import NProgress from "nprogress";
import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

export default View.extend({
  template,
  className: "wallet-transaction-list",

  regions: {
    overview: "#overview",
    walletOverview: "#wallet-overview",
    transactionList: "#transaction-list",
    paginationContainer: "#pagination-container",
    networkFooter: "#network-footer"
  },

  initialize(options) {
    this.target = options.target;
    this.excludeMined = true;

    if (this.target) {
      let self = this;

      NProgress.start();

      if (this.target === "all") {
        self.refreshTransactionCollection();
      } else {
        new Address({ address: this.target }).fetch({
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

            NProgress.set(0.25);

            self.model = model;
            self.address = self.model.get("address");

            self.refreshTransactionCollection();
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
      }
    } else {
      if (app.activeWallet && app.activeWallet.boundAddress) {
        this.model = app.activeWallet.boundAddress;
        this.address = this.model.get("address");

        this.refreshTransactionCollection();
      }
    }

    walletChannel.on("wallet:activeChanged", () => {
      if (this.target && !this.isDestroyed) {
        this.refreshTransactionCollection();
        return this.renderList();
      }

      if (app.activeWallet && app.activeWallet.boundAddress) {
        this.model = app.activeWallet.boundAddress;
        this.address = this.model.get("address");

        this.refreshTransactionCollection();
      }

      if (!this.isDestroyed) this.renderList();
    });
  },

  templateContext() {
    return {
      excludeMined: this.excludeMined
    };
  },

  onRender() {
    this.$("#exclude-mined input[type=checkbox]").change(() => {
      this.excludeMined = this.$("#exclude-mined input[type=checkbox]").is(":checked");

      if (this.transactions) {
        this.transactions.excludeMined = this.excludeMined;

        NProgress.start();

        const self = this;
        this.transactions.fetch({
          success() {
            NProgress.done();

            if (!self.isDestroyed) self.refreshTransactionCollection();
          }
        });
      }
    });

    if (this.model) {
      this.walletOverview.show(new WalletOverview({
        model: this.model,
        hideNames: true,
        showAllTransactionsButton: true
      }));

      if (this.transactions) this.renderList();
    } else if (this.target && this.target === "all" && this.transactions) {
      this.renderList();
    }

    this.networkFooter.show(new NetworkFooter());
  },

  renderList() {
    if (this.isDestroyed) return;

    this.transactionList.show(new TransactionListView({
      collection: this.transactions
    }));

    this.paginationContainer.show(new PaginationView({
      collection: this.transactions
    }));
  },

  refreshTransactionCollection() {
    const self = this;

    this.transactions = new TransactionCollection(null, {
      address: this.address,
      excludeMined: this.excludeMined
    });

    this.transactions.fetch({
      success() {
        NProgress.done();
        if (!self.isDestroyed) self.renderList();
      }
    });
  }
});