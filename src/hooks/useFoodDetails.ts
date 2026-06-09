import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./reduxHooks";
import { getFoodItemsThunk } from "../features/food/foodThunk";

export const useFoodDetails = () => {
  const { foodId } = useParams<{ foodId: string }>();
  const dispatch = useAppDispatch();
  const {
    items: menuItems,
    loading: foodLoading,
    error: foodError,
  } = useAppSelector((state) => state.food);
  const { items: cartItems, loading: cartLoading } = useAppSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    if (menuItems.length === 0) {
      dispatch(getFoodItemsThunk());
    }
  }, [dispatch, menuItems.length]);

  const item = useMemo(
    () => menuItems.find((foodItem) => foodItem._id === foodId),
    [menuItems, foodId],
  );

  const currentQuantity =
    item &&
    (cartItems.find((cartItem) => cartItem.food._id === item._id)?.quantity ??
      0);

  return {
    item,
    currentQuantity,
    foodLoading,
    foodError,
    cartLoading,
  };
};
