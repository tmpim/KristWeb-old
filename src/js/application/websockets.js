import Service from "backbone.service";
import Radio from "backbone.radio";

import $ from "jquery";

import app from "../app.js";

const WEBSOCKET_DISCONNECTED = 0;
const WEBSOCKET_CONNECTING = 1;
const WEBSOCKET_CONNECTED = 2;
const WEBSOCKET_CONNECTION_FAILED = 3;

let appChannel = Radio.channel("global");

const WebsocketService = Service.extend({
	start() {
		this.connectionStatus = WEBSOCKET_DISCONNECTED;
		this.websocket = null;
	},

	requests: {
		connect: "connect"
	},

	connect() {
		if (this.websocket) {
			this.websocket.close();
			this.websocket = null;
		}

		this.connectionStatus = WEBSOCKET_CONNECTING;
		appChannel.trigger("websocket:connectionStatusChanged", this.connectionStatus);

		$.ajax(app.syncNode + "/ws/start", {
			method: "POST",
			dataType: "json"
		}).done(data => {
			if (!data || !data.ok || !data.url) {
				this.connectionStatus = WEBSOCKET_CONNECTION_FAILED;
				appChannel.trigger("websocket:connectionStatusChanged", this.connectionStatus);

				app.error("Connection Error", "There was an error establishing a live connection to the server. The server may be down, or may be an outdated version of the Krist server.");
				console.error("Websocket error:");
				return console.error(data);
			}

			let url = data.url;

			if (app.syncNode.startsWith("http://")) {
				url = url.replace("wss://", "ws://");
			}

			this.websocket = new WebSocket(url);

			this.websocket.onmessage = this.onMessage.bind(this);
			this.websocket.onerror = this.onError.bind(this);
			this.websocket.onclose = this.onClose.bind(this);
		}).fail((jqXHR, textStatus, error) => {
			this.connectionStatus = WEBSOCKET_CONNECTION_FAILED;
			appChannel.trigger("websocket:connectionStatusChanged", this.connectionStatus);

			app.error("Connection Error", "There was an error establishing a live connection to the server. The server may be down, or may be an outdated version of the Krist server.");
			console.error("Websocket error:");
			console.error(error);
		});
	},

	onMessage(event) {
		let message = JSON.parse(event.data);

		switch (message.type) {
			case "hello":
				this.connectionStatus = WEBSOCKET_CONNECTED;
				appChannel.trigger("websocket:connectionStatusChanged", this.connectionStatus);
				break;
			case "keepalive":
				appChannel.trigger("websocket:keepalive");
				break;
		}
	},

	onError(event) {
		console.error(event);
	},

	onClose(event) {
		this.connectionStatus = WEBSOCKET_DISCONNECTED;
		appChannel.trigger("websocket:connectionStatusChanged", this.connectionStatus);

		console.log(`Websocket closed with code ${event.code} for reason ${event.reason}`);
	}
});

export default new WebsocketService();