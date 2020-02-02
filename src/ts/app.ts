import "./plugins";
import _ from "lodash";
import $ from "jquery";
import Backbone from "backbone";

import Application from "./application/application";

import UnsupportedBrowserTemplate from "./modal/unsupported-browser/template.hbs";
import Modal from "./modal/modal";

import LoginModal from "./modal/login/modal";

const app = new Application();
export default app;

// Check for features required by the application...
const requiredFeatures = [
  { 
    name: "Local Storage",
    tester: () => !!localStorage
  },
  { 
    name: "File APIs",
    tester: () => window.File && window.FileReader && window.FileList && window.Blob
  }
];
const missingFeatures = _.filter(requiredFeatures, f => !f.tester());

/** Show an error dialog listing required features that are missing */
function showMissingFeaturesDialog(features) {
  app.layout.modals.show(new (Modal.extend({
    dialog: UnsupportedBrowserTemplate,
    title: "Unsupported Browser",

    topCloseButton: false,
    closeButton: false,
    hideFooter: true,

    extraData: {
      features: _.map(features, "name")
    },

    beforeCancel: () => false,
  }))());
}

/** Prepare to start the application */
function init() {
  // Set up backbone history, allows navigating to URLs without pushing anything to the browser history
  Backbone.history.start({ pushState: true });

  // Don't make links refresh the whole page, unless data-bypass=true is set
  $(document).on("click", "a:not([data-bypass])", function (e) {
    let href = $(this).attr("href");
    let protocol = this.protocol + "//";

    if (href && protocol && href.slice(protocol.length) !== protocol) {
      e.preventDefault();

      // Navigate with the router instead
      app.router.navigate(href, true);
    }
  });
}

/** Show the login screen, or first password screen if this is a new setup */
function showLoginScreen() {
  app.layout.modals.show(new (LoginModal.extend({
    extraData: {
      firstTime: !localStorage.tester
    },

    topCloseButton: false,
    closeButton: false,

    beforeCancel: () => false,
    success: app.passwordReady
  }))());
}

if (missingFeatures.length > 0) {
  showMissingFeaturesDialog(missingFeatures);
} else { // All good, let's start
  init();
  showLoginScreen();
}
