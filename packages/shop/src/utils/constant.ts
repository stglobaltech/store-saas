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
export const WORK_FLOW_POLICY_NOT_CONFIGURED =
  "Your Store's work flow policy is not configured. Please contact our support team :)";
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
export const PREV_ORDER_INCOMPLETE =
  "Your Previous Order Is InComplete. Please wait for it to finish or expire :(";
export const CURRENT_ACTIVE_ORDER_NOT_FOUND =
  "We couldn't retrieve your current active order.Did you place an order? If yes try refreshing the page and wait for the summary to reflect or contact our support.Please wait for your order status to reflect. Do not place another order";
export const PAYMENT_STATUS_PENDING =
  "We are yet to confirm your payment. Please wait for your order summary to reflect,try refreshing your page. You can't place another order meanwhile";
export const USER_TRANSACTIONS_ERROR =
  "Error getting your transactions :(. Please try after some time";
export const OTP_SUCCESS_MSG = "Otp sent to your phone/email";
export const OTP_ERROR_MSG = "Something went wrong! OTP could not be sent...";
export const ERROR_INVALID_OTP = "Please enter the correct otp sent to your mobile number and email";
export const LOGIN_SUCCESS = "Login successful! Shop now...";
export const SIGNUP_SUCCESS_MSG = "signup successful!";
export const ERROR_CART_EMPTY = "Your cart is empty now!";
export const ADDRESS_ADDED_SUCCESSFULLY = "Address added successfully";
export const ERROR_ADD_ADDRESS = "failed to add address :(";
export const ADDRESS_DELETED_MSG = "address deleted!";
export const ERROR_DELETE_ADDRESS = "address not deleted :(";
export const ERROR_CANNOT_DELETE_ADDRESS = "address could not be deleted :(";
export const DELIVERY_ADDRESS_SET = "set as delivery address!";
export const DELIVERY_ADDRESS_NOT_SET = "delivery address could not be set";
export const PAYMENT_METHOD_SET_CASH = "Cash set as the payment method for this order";
export const PAYMENT_METHOD_SET_CARD = "Card set as the payment method for this order";
export const PAYMENT_METHOD_SET_WALLET = "Wallet set as the payment method for this order";
//active orders tracking status
export const USER_PLACED_ORDER = {
  intlKey: "statusOrderPlaced",
  label: "Order Placed",
  description: "User placed the order",
};
export const CHEF_ACCEPTED_ORDER = {
  intlKey: "statusChefAcceptedOrder",
  label: "Chef Accepted Order",
  description: "Chef accepted the order",
};
export const CHEF_DECLINED_THE_ORDER = {
  intlKey: "statusChefDeclinedOrder",
  label: "Chef Declined Order",
  description: "Chef declined the order",
};
export const CHEF_CANCELLED_THE_ORDER = {
  intlKey: "statusStoreCancelledOrder",
  label: "Store Cancelled Order",
  description: "Chef cancelled the order",
};
export const DELIVERED={
  intlKey: "statusDelivered",
  label:"Delivered",
  description:"User,RecievedOrder"
}
export const DRIVER_ACCEPTED_ORDER = {
  intlKey: "statusDriverFound",
  label: "Driver Found",
  description: "Driver accepted the order",
};
export const ORDER_READY_BY_CHEF = {
  intlKey: "statusOrderIsReady",
  label: "Your Order Is Ready",
  description: "Order Ready by chef",
};
export const DRIVER_REACHED_STORE = {
  intlKey: "statusDriverReachedStore",
  label: "Driver Reached Store",
  description: "Trip,ReachedStore",
};
export const DRIVER_COLLECTED_ORDER = {
  intlKey: "statusDriverPickedYourOrder",
  label: "Driver Picked Your Order",
  description: "Trip,Collected",
};
export const DRIVER_STARTED_JOURNEY = {
  intlKey: "statusOrderOutForDelivery",
  label: "Order Out For Delivery",
  description: "Trip,Delivered",
};
export const ORDER_DELIVERED = {
  intlKey: "statusOrderWasDelivered",
  label: "Your Order Was Delivered",
  description: "Trip,Delivered",
};
export const PAYMENT_REFUND_INITIATED = {
  label:
    "Something went wrong :(. We have initiated your refund to your wallet",
  description: "refundInitiated",
};
