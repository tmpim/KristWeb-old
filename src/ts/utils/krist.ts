function sha256(a) {
  return window.CryptoJS.SHA256(a).toString();
}

function hexToBase36(input) {
  for (var i= 6; i <= 251; i += 7) {
    if (input <= i) {
      if (i <= 69) {
        return String.fromCharCode(("0".charCodeAt(0)) + (i - 6) / 7);
      }

      return String.fromCharCode(("a".charCodeAt(0)) + ((i - 76) / 7));
    }
  }

  return "e";
}

export default {
  makeV2Address(key) {
    let chars = ["", "", "", "", "", "", "", "", ""];
    let prefix = "k";
    let hash = sha256(sha256(key));

    for (let i = 0; i <= 8; i++) {
      chars[i] = hash.substring(0, 2);
      hash = sha256(sha256(hash));
    }

    for (let i = 0; i <= 8;) {
      var index = parseInt(hash.substring(2 * i, 2 + (2 * i)), 16) % 9;

      if (chars[index] === "") {
        hash = sha256(hash);
      } else {
        prefix += hexToBase36(parseInt(chars[index], 16));
        chars[index] = "";
        i++;
      }
    }

    return prefix;
  },

  parseCommonMeta(metadata) {
    if (!metadata) return null;

    const parts = {};

    const metaParts = metadata.split(";");
    if (metaParts.length <= 0) return null;

    const nameMatches = /^(?:([a-z0-9-_]{1,32})@)?([a-z0-9]{1,64}\.kst)$/.exec(metaParts[0]);

    if (nameMatches) {
      if (nameMatches[1]) parts.metaname = nameMatches[1];
      if (nameMatches[2]) parts.name = nameMatches[2];

      parts.recipient = nameMatches[1] ? nameMatches[1] + "@" + nameMatches[2] : nameMatches[2];
    }

    for (let i = 0; i < metaParts.length; i++) {
      const metaPart = metaParts[i];
      const kv = metaPart.split("=", 2);

      if (i === 0 && nameMatches) continue;

      if (kv.length === 1) {
        parts[i.toString()] = kv[0];
      } else {
        parts[kv[0]] = kv.slice(1).join("=");
      }
    }

    return parts;
  }
};