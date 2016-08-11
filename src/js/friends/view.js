import $ from "jquery";
import _ from "lodash";

import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import EditFriendView from "./edit-friend-view";
import FriendListView from "./list-view";
import AddFriendModal from "../modal/add-friend/modal";

import Radio from "backbone.radio";

import app from "../app";

let appChannel = Radio.channel("global");
let friendChannel = Radio.channel("friend");

export default LayoutView.extend({
	template: template,
	className: "friends",

	regions: {
		friendList: "#friend-list",
		friendEditContainer: "#friend-edit-container"
	},

	ui: {
		friendListContainer: "#friend-list-container",
		friendListAddFriend: ".friend-list-add-friend",
		friendEditContainer: "#friend-edit-container"
	},

	triggers: {
		"click @ui.friendListAddFriend": "add:friend"
	},

	initialize() {
		console.log("Friends/view init");

		appChannel.on("syncNode:changed", () => {
			console.log("Syncnode was changed");

			app.selectedFriend = null;

			this.friendList.show(new FriendListView({
				collection: app.friends,
				container: this
			}));

			this.friendEditContainer.reset();
		});

		friendChannel.on("friendsList:activeChanged", friend => {
			console.log("Active friendslist friend was changed");

			this.friendEditContainer.show(new EditFriendView({
				model: friend
			}));
		});
	},

	onAttach() {
		console.log("Friends/view attach");

		if (app.friends) {
			console.log("Friends/view attach has friends");

			app.selectedFriend = null;

			this.friendList.show(new FriendListView({
				collection: app.friends,
				container: this
			}));

			this.friendEditContainer.reset();
		}

		this.ui.friendListContainer.mCustomScrollbar({
			scrollInertia: 500
		});
	},

	onAddFriend() {
		app.layout.modals.show(new AddFriendModal());
	}
});