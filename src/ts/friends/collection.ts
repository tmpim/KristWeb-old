import { Collection } from "backbone";
import { LocalStorage } from "backbone.localstorage";

import FriendModel from "./model";
import EncryptedLocalStorage from "../application/encrypted-local-storage";

export default Collection.extend({
  model: FriendModel,

  localStorage: new LocalStorage("Friend", EncryptedLocalStorage),

  viewComparator: "position"
});