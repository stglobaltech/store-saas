/************ CONSTANTS ***********/
export const CURRENCY = "SAR";
export const GENERAL_ERROR_MSG = "Something went wrong :(";
export const ERROR_FETCHING_CART = "Error fetching your cart :(";
export const ERROR_FETCHING_USER_DETAILS =
  "Error fetching your details! Login again and try or try after sometime :(";
export const ADD_PRODUCT_TO_CART_FAILED =
  "Something went wrong!Product could not be added to cart!";
export const ERROR_FETCHING_YOUR_LAST_ORDER = `
Error fetching your lastest order summary :(
Contact Customer Support
  `;
export const ERROR_CART_DELETED = "No products in the cart. Cart Deleted";
export const CART_DOES_NOT_EXIST = "CART_DOES_NOT_EXISTS";
export const CHEF_NOT_AVAILABLE = "Chef not available";
export const MINIMUM_ORDER_VALIDATION = "Order Cost should be more than";
export const ADDRESS_DELETED = "SUCCESS";
export const UNAUTHORIZED = "Unauthorized";
export const UNAUTHORIZED_MSG =
  "Please login to fetch your last order summary :)";
export const ERROR_FETCHING_ACTIVE_ORDERS =
  "Error fetching your active orders :( . Trying logging in again or contact our support team.";
export const ERROR_FETCHING_ORDER_HISTORY =
  "Error fetching your order history :( . Try refreshing the page or try after sometime.";

export const NO_ACTIVE_ORDERS_FOUND =
  "No Active Orders Found. Place An Order :)";
export const NO_ORDERS_MADE =
  "No More Orders Found. Place An Order And Here You Can Fetch Your Order History :)";
export const CURRENT_ACTIVE_ORDER_NOT_FOUND =
  "We couldn't retrieve your current active order.Did you place an order? If yes try refreshing the page or contact our support";

//active orders tracking status
export const USER_PLACED_ORDER = {
  label: "Order Placed. Waiting For Chef To Accept",
  description: "User placed the order",
};
export const CHEF_ACCEPTED_ORDER = {
  label: "Chef Accepted Order",
  description: "Chef accepted the order",
};
export const CHEF_DECLINED_THE_ORDER = {
  label: "Chef Declined Order",
  description: "Chef declined the order",
};
export const CHEF_CANCELLED_THE_ORDER = {
  label: "Chef Cancelled Order",
  description: "Chef cancelled the order",
};
export const DRIVER_ACCEPTED_ORDER = {
  label: "Delivery Executive Found",
  description: "Driver accepted the order",
};
export const ORDER_READY_BY_CHEF = {
  label: "Your Order Is Ready To Be Picked Up",
  description: "Order Ready by chef",
};
export const DRIVER_REACHED_STORE = {
  label: "Delivery Executive Reached Store",
  description: "Trip,ReachedStore",
};
export const DRIVER_COLLECTED_ORDER = {
  label: "Our Delivery Executive Picked Your Order",
  description: "Trip,Collected",
};
export const DRIVER_STARTED_JOURNEY = {
  label: "Your Order Is Out For Delivery",
  description: "Trip,Delivered",
};
export const ORDER_DELIVERED = {
  label: "Your Order Was Delivered",
  description: "Trip,Delivered",
};
