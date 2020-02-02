import _ from "lodash";
import $ from "jquery";

import { View } from "backbone.marionette";

import template from "./template.hbs";

export default View.extend({
  template,
  className: "pagination",

  ui: {
    paginationLeft: ".pagination-left",
    paginationRight: ".pagination-right"
  },

  triggers: {
    "click @ui.paginationLeft": "page:prev",
    "click @ui.paginationRight": "page:next"
  },

  events: {
    "click .pagination-page": "onPageChange"
  },

  initialize(options) {
    this.collection = options.collection;

    this.listenTo(this.collection, "reset", this.render);
  },

  serializeData() {
    return {
      window: this.calculateWindow(),
      total: this.collection.state.totalRecords,
      pages: this.collection.state.totalPages
    };
  },

  templateContext: {
    windowHandles() {
      return _.range(this.window[0], this.window[1]);
    },

    normalise(index) {
      return index + 1;
    },

    localise(number) {
      return Number(number).toLocaleString();
    }
  },

  shouldSlide(currentPage, windowSize) {
    return Math.round(currentPage % windowSize / windowSize);
  },

  slideAmount(windowSize, slideScale) {
    return ~~(windowSize * slideScale);
  },

  calculateWindow() {
    let collection = this.collection;
    let state = collection.state;

    let firstPage = state.firstPage;

    let lastPage = +state.lastPage;
    lastPage = Math.max(0, firstPage ? lastPage - 1 : lastPage);

    let currentPage = Math.max(state.currentPage, state.firstPage);
    currentPage = firstPage ? currentPage - 1 : currentPage;

    let windowSize = 5;
    let slideScale = 0.5;

    let windowStart = Math.floor(currentPage / windowSize) * windowSize;

    if (currentPage <= lastPage - this.slideAmount()) {
      windowStart += (this.shouldSlide(currentPage, windowSize) *
              this.slideAmount(windowSize, slideScale));
    }

    let windowEnd = Math.min(lastPage + 1, windowStart + windowSize);

    return [windowStart, windowEnd];
  },

  onRender() {
    let currentPage = this.collection.state.currentPage;

    this.$(`[data-index=${currentPage}]`).addClass("active");
  },

  onPageChange(e) {
    let $el = $(e.target);

    if (!$el.hasClass("active")) {
      this.collection.getPage(Number($el.attr("data-index")), { reset: true });
    }
  },

  onPagePrev() {
    this.collection.getPreviousPage({ reset: true });
  },

  onPageNext() {
    this.collection.getNextPage({ reset: true });
  }
});