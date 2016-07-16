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
	}
};