import app from "../app";

export default function(Handlebars) {
  Handlebars.registerHelper("nl2br", function(text) {
    text = Handlebars.Utils.escapeExpression(text);
    let nl2br = (text + "").replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, "$1" + "<br>" + "$2");
    return new Handlebars.SafeString(nl2br);
  });

  Handlebars.registerHelper("addressLabel", address => {
    address = Handlebars.Utils.escapeExpression(address);

    if (!app) return new Handlebars.SafeString(address);
    if (app.activeWallet && address === app.activeWallet.get("address")) return new Handlebars.SafeString("You");
    if (!app.friends || !app.wallets) return new Handlebars.SafeString(address);

    const search = { address, syncNode: app.syncNode };
    const label = app.friends.findWhere(search) || app.wallets.findWhere(search);

    return new Handlebars.SafeString((label ? label.get("label") : address) || address);
  });

  Handlebars.registerHelper("ifeq", function(a, b, options) {
    return (a === b ? options.fn : options.inverse)(this);
  });

  Handlebars.registerHelper("krist", function(number) {
    return Number(number).toLocaleString() + " KST";
  });
}
