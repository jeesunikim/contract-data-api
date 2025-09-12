const express = require("express");
const { getKeysByContractId } = require("../controllers/contract_data");

const router = express.Router();

router.get("/contract/:contract_id/keys", getKeysByContractId);

module.exports = router;
