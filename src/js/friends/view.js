import $ from "jquery";
import _ from "lodash";

import {LayoutView} from "backbone.marionette";
import template from "./template.hbs";

import AddFriendModal from "../modal/add-friend/modal";

import app from "../app";

export default LayoutView.extend({
	template: template,
	className: "friends",

	ui: {
		friendsListAddFriend: "#friends-list-add-friend"
	},

	triggers: {
		"click @ui.friendsListAddFriend": "add:friend"
	},

	onAddFriend() {
		app.layout.modals.show(new AddFriendModal());
	}
});