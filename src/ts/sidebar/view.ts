import { View } from "backbone.marionette";
import template from "./template.hbs";

export default View.extend({
  template,
  tagName: "nav",
  id: "sidebar-content",

  collectionEvents: {
    all: "render"
  },

  templateContext() {
    return {
      sidebarItems: this.collection.toJSON()
    };
  },

  onRender() {
    setTimeout((() => {
      this.$(".sidebar-item-container").mCustomScrollbar({
        scrollInertia: 500,
        theme: "dark"
      });
    }).bind(this), 250);
  }
});