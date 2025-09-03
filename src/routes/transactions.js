const express = require("express");
const { getTransactionByHash } = require("../controllers/transaction");

const router = express.Router();

router.get("/:transaction_hash", getTransactionByHash);

module.exports = router;