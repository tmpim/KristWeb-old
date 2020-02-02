import { View } from "backbone.marionette";
import template from "./template.hbs";

export default View.extend({
  template,
  id: "settings-notifications",

  ui: {
    notificationsEnabledCheckbox: "#notifications-enabled",
    notificationSettingsRow: "#all-settings"
  },

  events: {
    "click #notifications-enabled": "toggleNotifications"
  },

  initialize() {
  },

  toggleNotifications() {
    let enabled = this.ui.notificationsEnabledCheckbox.find("input").is(":checked");

    if (enabled) {
      this.ui.notificationSettingsRow.removeClass("row-disabled");
    } else {
      this.ui.notificationSettingsRow.addClass("row-disabled");
    }
  }
});