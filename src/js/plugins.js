window.CryptoJS = require("browserify-cryptojs");
require("browserify-cryptojs/components/enc-base64");
require("browserify-cryptojs/components/md5");
require("browserify-cryptojs/components/evpkdf");
require("browserify-cryptojs/components/cipher-core");
require("browserify-cryptojs/components/aes");
require("browserify-cryptojs/components/sha256");

import Backbone from "backbone";

Backbone.$ = window.jQuery = window.$ = require("jquery");

import "babel-polyfill";

import MalihuCustomScrollbarPlugin from "malihu-custom-scrollbar-plugin";
MalihuCustomScrollbarPlugin(window.$);

import "./libs/dense.min.js";
import "prefixfree";
import "select2";
import "cropper";
import "timeago";              

import Marionette from "backbone.marionette";
import Modals from "backbone.modal";

if (window.__agent) {
	window.__agent.start(Backbone, Marionette);
}

Marionette.Behaviors.behaviorsLookup = function() {
	return window.Behaviors;
};