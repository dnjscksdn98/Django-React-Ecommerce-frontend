const localhost = "http://127.0.0.1:8000";

const apiURL = "/api";

export const endpoint = `${localhost}${apiURL}`;

export const productListURL = `${endpoint}/product-list/`;
export const addToCartURL = `${endpoint}/add-to-cart/`;
export const orderItemDeleteURL = id => `${endpoint}/order-item/${id}/delete/`;
export const orderItemSubtractURL = `${endpoint}/order-item/subtract/`;
export const orderSummaryURL = `${endpoint}/order-summary/`;
export const checkoutURL = `${endpoint}/checkout/`;
export const paymentListURL = `${endpoint}/payments/`;
export const addCouponURL = `${endpoint}/add-coupon/`;
export const addressListURL = addressType =>
  `${endpoint}/address/list/?address_type=${addressType}`;
export const addressCreateURL = `${endpoint}/address/create/`;
export const addressUpdateURL = id => `${endpoint}/address/${id}/update/`;
export const addressDeleteURL = id => `${endpoint}/address/${id}/delete/`;
export const countryListURL = `${endpoint}/country/list/`;
export const userIDURL = `${endpoint}/user/id/`;
