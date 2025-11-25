import * as tf from "@tensorflow/tfjs-node";
import { fetchUserActivity } from "./fetch-user-activity.service";
import { preProcessData } from "../utils/preProcessData";

const EMBEDDING_DIM = 50;

interface UserAction {
  userId: string;
  productId: string;
  actionType: "product_view" | "add_to_cart" | "add_to_wishlist" | "purchase";
}

interface Interaction {
  userId: string;
  productId: string;
  actionType: UserAction["actionType"];
}

interface Interaction {
  productId: string;
  score: number;
}

async function fetchUserActvity(userId: string): Promise<UserAction[]> {
  const userActions = await fetchUserActvity(userId);
  return Array.isArray(userActions)
    ? (userActions as unknown as UserAction[])
    : [];
}

export const recommendProducts = async (
  userId: string,
  allProducts: any
): Promise<string[]> => {
  const userActions: UserAction[] = await fetchUserActvity(userId);

  if (userActions.length === 0) {
    return [];
  }

  const processData = preProcessData(userActions, allProducts);

  if (!processData || !processData.interactions || !processData.products) {
    return [];
  }

  const { interactions } = processData as {
    interactions: Interaction[];
  };

  return interactions.map((interaction) => interaction.productId);
};
