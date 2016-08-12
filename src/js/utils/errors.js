import app from "../app";

let errorMap = {
	"address_not_found": "Address not found.",
	"transaction_not_found": "Transaction not found.",
	"block_not_found": "Block not found."
};

let missingParameterMap = {
	"address": "Address is required."
};

let invalidParameterMap = {
	"address": "Invalid address.",
	"transaction": "Invalid transaction ID.",
	"height": "Invalid block ID."
};

export default error => {
	if (app.epic) {
		return "#1000B You are not allowed to visit this community.";
	}

	let err = error;

	if (err.error) {
		err = error.error;
	}

	switch (err) {
		case "missing_parameter":
			if (missingParameterMap[error.parameter]) {
				return missingParameterMap[error.parameter];
			}

			return `Missing parameter: ${error.parameter}.`;

		case "invalid_parameter":
			if (invalidParameterMap[error.parameter]) {
				return invalidParameterMap[error.parameter];
			}

			return `Invalid parameter: ${error.parameter}.`;

		default:
			if (errorMap[err]) {
				return errorMap[err];
			}

			return `Unknown error: ${err}.`;
	}
};