import Backbone from "backbone";

import $ from "jquery";

// TODO: Used to share the jQuery version between everything, might not be necessary anymore
// Backbone.$ = window.jQuery = window.$ = $;

// Use POST instead of PUT, PATCH and DELETE (Krist v2 API)
Backbone.emulateHTTP = true;

import MalihuCustomScrollbarPlugin from "malihu-custom-scrollbar-plugin";
MalihuCustomScrollbarPlugin($);

import "./libs/dense.min";
import "selectize";
import "./libs/selectize/dropdown-header";
import "cropper";
import "timeago";

$.timeago.settings.localeTitle = true;

import Marionette from "backbone.marionette";