window.CryptoJS = require("browserify-cryptojs");
require("browserify-cryptojs/components/enc-base64");
require("browserify-cryptojs/components/md5");
require("browserify-cryptojs/components/evpkdf");
require("browserify-cryptojs/components/cipher-core");
require("browserify-cryptojs/components/aes");

import Backbone from "backbone";

import $ from "jquery";
Backbone.$ = $;
window.$ = $;

import Marionette from "backbone.marionette";
import Modals from "backbone.modal";

import "babel-polyfill";

import "nanoscroller";
import "./dense.min.js";
import "prefixfree";

if (window.__agent) {
	window.__agent.start(Backbone, Marionette);
}