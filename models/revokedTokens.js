const mongoose = require("mongoose");

const revokedTokensSchema = new mongoose.Schema({
    revTokens: { type: String}
});

const Revoked = mongoose.model("Revoked", revokedTokensSchema);

module.exports = Revoked;
