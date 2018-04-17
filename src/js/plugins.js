import Backbone from "backbone";

import $ from "jquery";

Backbone.$ = window.jQuery = window.$ = $;
Backbone.emulateHTTP = true;

import MalihuCustomScrollbarPlugin from "malihu-custom-scrollbar-plugin";
MalihuCustomScrollbarPlugin(window.$);

import "./libs/dense.min";
import "prefixfree";
import "selectize";
import "./libs/selectize/dropdown-header";
import "cropper";
import "timeago";

window.$.timeago.settings.localeTitle = true;

import Marionette from "backbone.marionette";
import "backbone.modal";

if (window.__agent) {
	window.__agent.start(Backbone, Marionette);
}

Marionette.Behaviors.behaviorsLookup = function() {
	return window.Behaviors;
};
