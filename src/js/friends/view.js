import $ from "jquery";
import _ from "lodash";

import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import FriendListView from "./list-view";
import AddFriendModal from "../modal/add-friend/modal";

import Radio from "backbone.radio";

import app from "../app";

let appChannel = Radio.channel("global");

export default LayoutView.extend({
	template: template,
	className: "friends",

	regions: {
		friendList: "#friend-list"
	},

	ui: {
		friendListContainer: "#friend-list-container",
		friendListAddFriend: "#friend-list-add-friend"
	},

	triggers: {
		"click @ui.friendListAddFriend": "add:friend"
	},

	initialize() {
		appChannel.on("syncNode:changed", syncNode => {
			this.friendList.show(new FriendListView({
				collection: app.friends,
				container: this.friendList
			}));
		});
	},

	onAttach() {
		this.ui.friendListContainer.mCustomScrollbar({
			scrollInertia: 500
		});
	},

	onAddFriend() {
		app.layout.modals.show(new AddFriendModal());
	}
});