<script setup>
import { onMounted, ref } from 'vue';
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
import CouponModal from '@/components/admin/CouponModal.vue';
import DelCouponModal from '@/components/admin/DelCouponModal.vue';
import Pagination from '@/components/Pagination.vue';
import {
  apiGetAdminCoupons,
  apiAddAdminCoupon,
  apiEditAdminCoupon,
  apiDeleteAdminCoupon,
} from '@/utils/api.js';

import { SwalHandle } from '@/utils/sweetalert2.js';
import { useLoaderStore } from '@/stores/useLoaderStore.js';
const loaderStore = useLoaderStore();

let couponModalHandle = null;
let delCouponModalHandle = null;

const coupons = ref([]);
const tempCoupon = ref({
  title: '',
  is_enabled: 1,
  percent: 0,
  due_date: '',
  code: '',
  xxx_date: '',
});
const isNew = ref(true);

const pagination = ref({});
const couponModalRef = ref(null);
const delCouponModalRef = ref(null);

const formatToTimestamp = (date) => {
  return Math.floor(new Date(date).getTime() / 1000);
};
const formatToDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const getCoupons = (page = 1) => {
  loaderStore.changeIsLoading(true);
  apiGetAdminCoupons(page)
    .then((res) => {
      coupons.value = res.data.coupons;
      pagination.value = res.data.pagination;
      loaderStore.changeIsLoading(false);
    })
    .catch((error) => {
      console.log(error);
      loaderStore.changeIsLoading(false);
    });
};

const openCouponModal = (status, coupon) => {
  if (status === 'new') {
    isNew.value = true;
    tempCoupon.value = {
      title: '',
      is_enabled: 0,
      percent: 0,
      due_date: '',
      code: '',
      xxx_date: '',
    };
    couponModalHandle.show();
  } else {
    isNew.value = false;
    tempCoupon.value = { ...coupon };
    status === 'edit' ? couponModalHandle.show() : delCouponModalHandle.show();
  }
};

const updateCoupon = () => {
  tempCoupon.value.due_date = formatToTimestamp(tempCoupon.value.xxx_date);
  const data = { data: tempCoupon.value };
  const tempCouponId = tempCoupon.value.id;
  if (isNew.value === true) {
    apiAddAdminCoupon(data)
      .then(() => {
        getCoupons();
        SwalHandle.showSuccessMsg('優惠券新增成功～');
        couponModalHandle.hide();
      })
      .catch((error) => {
        SwalHandle.showErrorMsg(error.response.data.message);
        couponModalHandle.hide();
      });
  } else {
    apiEditAdminCoupon(data, tempCouponId)
      .then(() => {
        getCoupons();
        SwalHandle.showSuccessMsg('優惠券編輯成功～');
        couponModalHandle.hide();
      })
      .catch((error) => {
        SwalHandle.showErrorMsg(error.response.data.message);
        couponModalHandle.hide();
      });
  }
};

const deleteCoupon = () => {
  const tempCouponId = tempCoupon.value.id;
  apiDeleteAdminCoupon(tempCouponId)
    .then(() => {
      SwalHandle.showSuccessMsg('優惠券刪除成功～');
      getCoupons();
      delCouponModalHandle.hide();
    })
    .catch((error) => {
      SwalHandle.showErrorMsg(error.response.data.message);
      delCouponModalHandle.hide();
    });
};

onMounted(() => {
  getCoupons();
  couponModalHandle = new bootstrap.Modal(couponModalRef.value, {});
  delCouponModalHandle = new bootstrap.Modal(delCouponModalRef.value, {});
});
</script>

<template>
  <div class="mt-4">
    <h2>優惠券列表</h2>
    <div class="text-end mt-sm-2 mt-4">
      <button type="button" class="btn btn-primary" @click="openCouponModal('new')">
        新增優惠券
      </button>
    </div>
    <table class="table-admin table-rwd mt-3">
      <thead>
        <tr>
          <th>名稱</th>
          <th>折扣百分比</th>
          <th>到期日</th>
          <th>是否啟用</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="coupon in coupons" :key="coupon.id">
          <td data-th="名稱">{{ coupon.title }}</td>
          <td data-th="折扣百分比">{{ coupon.percent }}</td>
          <td data-th="到期日">{{ formatToDate(coupon.xxx_date) }}</td>
          <td data-th="是否啟用">
            <span v-if="coupon.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td data-th="編輯">
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openCouponModal('edit', coupon)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openCouponModal('delete', coupon)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pagination="pagination" @update="getCoupons"></Pagination>

    <div
      ref="couponModalRef"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <CouponModal :tempCoupon="tempCoupon" @updateCoupon="updateCoupon" />
    </div>
    <div
      ref="delCouponModalRef"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <DelCouponModal :tempCoupon="tempCoupon" @deleteCoupon="deleteCoupon" />
    </div>
  </div>
</template>

<style></style>
