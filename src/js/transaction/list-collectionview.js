import {CollectionView} from "backbone.marionette";
import template from "./template.hbs";

import ListItemView from "./list-item";

export default CollectionView.extend({
	template: template,
	className: "col-xs-12",

	childView: ListItemView
});