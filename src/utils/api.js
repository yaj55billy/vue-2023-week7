import axios from 'axios';
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

// 後台相關
export const apiAdminBase = axios.create({
  baseURL: `${VITE_API_BASE}`,
});

// 後台驗證
export const apiAdminCheck = () => apiAdminBase.post('/api/user/check', {});

// 登出
export const apiSignOut = () => apiAdminBase.post('/logout');

// 後台取得產品列表
export const apiGetAdminProducts = (page = 1) =>
  apiAdminBase.get(`/api/${VITE_API_PATH}/admin/products?page=${page}`);

// 後台新增產品
export const apiAddAdminProduct = (data) =>
  apiAdminBase.post(`/api/${VITE_API_PATH}/admin/product`, data);

// 後台編輯產品
export const apiEditAdminProduct = (data, id) =>
  apiAdminBase.put(`/api/${VITE_API_PATH}/admin/product/${id}`, data);

// 後台刪除產品
export const apiDeleteAdminProduct = (id) =>
  apiAdminBase.delete(`/api/${VITE_API_PATH}/admin/product/${id}`);

// 後台取得優惠券列表
export const apiGetAdminCoupons = (page = 1) =>
  apiAdminBase.get(`/api/${VITE_API_PATH}/admin/coupons?page=${page}`);

// 後台新增優惠券
export const apiAddAdminCoupon = (data) =>
  apiAdminBase.post(`/api/${VITE_API_PATH}/admin/coupon`, data);

// 後台編輯優惠券
export const apiEditAdminCoupon = (data, id) =>
  apiAdminBase.put(`/api/${VITE_API_PATH}/admin/coupon/${id}`, data);

// 後台刪除優惠券
export const apiDeleteAdminCoupon = (id) =>
  apiAdminBase.delete(`/api/${VITE_API_PATH}/admin/coupon/${id}`);

// 後台取得訂單列表
export const apiGetAdminOrders = (page = 1) =>
  apiAdminBase.get(`/api/${VITE_API_PATH}/admin/orders?page=${page}`);

// 後台編輯訂單
export const apiEditAdminOrder = (data, id) =>
  apiAdminBase.put(`/api/${VITE_API_PATH}/admin/order/${id}`, data);

// 後台刪除訂單
export const apiDeleteAdminOrder = (id) =>
  apiAdminBase.delete(`/api/${VITE_API_PATH}/admin/order/${id}`);

// 後台上傳圖片
export const apiUploadAdminImage = (fileData) =>
  apiAdminBase.post(`/api/${VITE_API_PATH}/admin/upload`, fileData);

// 前台
export const apiBase = axios.create({
  baseURL: `${VITE_API_BASE}`,
});
