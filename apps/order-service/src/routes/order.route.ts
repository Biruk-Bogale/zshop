import isAuthenticated from "@packages/middleware/isAuthenticated";
import express, { Router } from "express";
import {
  createPayementIntent,
  createPayementSession,
  getOrdersDetails,
  getSellerOrders,
  updateDeliveryStatus,
  verifyCouponCode,
  verifyPayementSession,
} from "../controllers/order.controller";
import { isSeller } from "@packages/middleware/authorizeRoles";

const router: Router = express.Router();

router.post("/create-payment-session", isAuthenticated, createPayementSession);
router.post("/create-payment-intent", isAuthenticated, createPayementIntent);
router.get(
  "/verifying-payment-session",
  isAuthenticated,
  verifyPayementSession
);
router.get("/get-seller-orders", isAuthenticated, isSeller, getSellerOrders);
router.get("/get-order-details/:id", isAuthenticated, getOrdersDetails);
router.put(
  "/update-status/:orderId",
  isAuthenticated,
  isSeller,
  updateDeliveryStatus
);
router.put("/verify-coupon", isAuthenticated, verifyCouponCode);

export default router;
