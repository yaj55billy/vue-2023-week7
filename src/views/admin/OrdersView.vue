<script setup>
import { onMounted, ref } from 'vue';
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
import DelOrderModal from '@/components/admin/DelOrderModal.vue';
import Pagination from '@/components/Pagination.vue';

import { apiGetAdminOrders, apiEditAdminOrder, apiDeleteAdminOrder } from '@/utils/api.js';
import { formatToDate } from '@/utils/formatToDate.js';

import { SwalHandle } from '@/utils/sweetalert2.js';
import { useLoaderStore } from '@/stores/useLoaderStore.js';
const loaderStore = useLoaderStore();

let delOrderModalHandle = null;

const orders = ref([]);
const tempOrder = ref({});
const pagination = ref({});
const delOrderModalRef = ref(null);

const openOrderModal = (status, order) => {
  if (status === 'delete') {
    tempOrder.value = { ...order };
    delOrderModalHandle.show();
  }
};

const getOrders = (page = 1) => {
  loaderStore.changeIsLoading(true);
  apiGetAdminOrders(page)
    .then((res) => {
      orders.value = res.data.orders;
      pagination.value = res.data.pagination;
      loaderStore.changeIsLoading(false);
    })
    .catch((error) => {
      console.log(error);
      loaderStore.changeIsLoading(false);
    });
};
// 更換付款狀態
const updateOrderPaid = (order) => {
  loaderStore.changeIsLoading(true);
  const paid = {
    is_paid: order.is_paid,
  };
  apiEditAdminOrder({ data: paid }, order.id)
    .then(() => {
      getOrders();
      SwalHandle.showSuccessMsg('訂單更換付款狀態成功～');
      loaderStore.changeIsLoading(false);
    })
    .catch((error) => {
      SwalHandle.showErrorMsg(error.response.data.message);
      loaderStore.changeIsLoading(false);
    });
};

const deleteOrder = () => {
  const tempOrderId = tempOrder.value.id;
  apiDeleteAdminOrder(tempOrderId)
    .then(() => {
      SwalHandle.showSuccessMsg('訂單刪除成功～');
      getOrders();
      delOrderModalHandle.hide();
    })
    .catch((error) => {
      SwalHandle.showErrorMsg(error.response.data.message);
      delOrderModalHandle.hide();
    });
};

onMounted(() => {
  getOrders();
  delOrderModalHandle = new bootstrap.Modal(delOrderModalRef.value, {});
});
</script>

<template>
  <div class="mt-4">
    <h2>訂單列表</h2>
    <table class="table table-admin table-rwd mt-4">
      <thead>
        <tr>
          <th>下單時間</th>
          <th>Email</th>
          <th>購買款項</th>
          <th>應付金額</th>
          <th>是否付款</th>
          <th>編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td data-th="下單時間">{{ formatToDate(order.create_at) }}</td>
          <td data-th="Email">{{ order.user.email }}</td>
          <td data-th="購買款項">
            <ul class="list-unstyled">
              <li v-for="orderProduct in order.products" :key="orderProduct.id">
                {{ orderProduct.product.title }} 數量：{{ orderProduct.qty }}
                {{ orderProduct.product.unit }}
              </li>
            </ul>
          </td>
          <td data-th="應付金額" v-thousands="order.total"></td>
          <td data-th="是否付款">
            <div class="form-check form-switch">
              <input
                type="checkbox"
                role="switch"
                :id="`paidSwitch${order.id}`"
                class="form-check-input"
                v-model="order.is_paid"
                @change="updateOrderPaid(order)"
              />
              <label class="form-check-label" :for="`paidSwitch${order.id}`">
                <span> {{ order.is_paid ? '已付款' : '未付款' }}</span>
              </label>
            </div>
          </td>
          <td data-th="編輯">
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openOrderModal('delete', order)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <Pagination :pagination="pagination" @updatePage="getOrders"></Pagination>

    <div
      ref="delOrderModalRef"
      class="modal fade"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <DelOrderModal :tempOrder="tempOrder" @deleteOrder="deleteOrder" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
// input[type="checkbox"] {
// 	margin-right: 3px;
// 	vertical-align: middle;
// }
</style>
