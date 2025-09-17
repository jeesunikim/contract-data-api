import express from "express";
import { getKeysByContractId } from "../controllers/contract_data";

const router = express.Router();

router.get("/contract/:contract_id/keys", getKeysByContractId);

export default router;