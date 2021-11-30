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

//active orders tracking status
export const PENDING = { label: "PEN", value: "Pending" };
export const STORE_ACCEPTED = {
  label: "StoreAcceptedOrder",
  value: "Store Accepted Order",
};
export const STORE_ORDER_READY = {
  label: "StoreOrderReady",
  value: "Your Order Is Ready To Be Picked By One Of Our Delivery Executive",
};
export const STORE_CANCELLED_ORDER = {
  label: "StoreCanceledOrder",
  value: "Store Cancelled Your Order",
};
export const STORE_REJECTED_ORDER = {
  label: "StoreDeclineOrder",
  value: "Store Rejected Order",
};
export const DRIVER_ON_THE_WAY_TO_STORE = {
  label: "Pickup",
  value: "Driver On The Way To Store",
};
export const REACHED_STORE = {
  label: "ReachedStore",
  value: "Driver Reached Store",
};
export const OUT_FOR_DELIVERY = {
  label: "OutForDelivery",
  value: "Out For Delivery",
};
export const DELIVERED = { label: "Delivered", value: "Delivered" };
//order history tracking status
export const OH_PENDING = { label: "PEN", value: "Pending" };
export const OH_CONF = { label: "CONF", value: "order Confirmed" };
export const OH_EXP = { label: "EXP", value: "Order Expired" };
export const OH_FINISHED = { label: "FIN", value: "Order Finished" };
export const OH_CANCELLED = { label: "CAN", value: "Order Cancelled" };
export const OH_REJECTED = { label: "REJ", value: "Order Rejected" };
export const NO_ACTIVE_ORDERS_FOUND =
  "No Active Orders Found. Place An Order :)";
export const NO_ORDERS_MADE =
  "No More Orders Found. Place An Order And Here You Can Fetch Your Order History :)";
export const CURRENT_ACTIVE_ORDER_NOT_FOUND =
  "We couldn't retrieve your current active order.Did you place an order? If yes try refreshing the page or contact our support";
