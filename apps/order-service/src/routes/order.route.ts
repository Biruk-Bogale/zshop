import isAuthenticated from "@packages/middleware/isAuthenticated";
import express, { Router } from "express";
import {
  createPayementIntent,
  createPayementSession,
  verifyPayementSession,
} from "../controllers/order.controller";

const router: Router = express.Router();

router.post("/create-payment-session", isAuthenticated, createPayementSession);
router.post("/create-payment-intent", isAuthenticated, createPayementIntent);
router.get(
  "/verifying-payment-session",
  isAuthenticated,
  verifyPayementSession
);

export default router;
