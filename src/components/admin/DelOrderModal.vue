<script setup>
import { toRefs } from 'vue';
import { formatToDate } from '@/utils/formatToDate.js';

const props = defineProps({
  tempOrder: Object,
});
const { tempOrder } = toRefs(props);

const emit = defineEmits(['deleteOrder']);
const handleDeleteClick = () => {
  emit('deleteOrder');
};
</script>
<template>
  <div class="modal-dialog" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-danger text-white">
        <h5 id="exampleModalLabel" class="modal-title">
          <span>刪除訂單</span>
        </h5>
        <button
          type="button"
          class="btn-close white"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        是否刪除此筆訂單(刪除後將無法恢復)：
        <div class="mt-3">
          <p class="mb-0">日期：{{ formatToDate(tempOrder.create_at) }}</p>
          <ul>
            <li v-for="orderProduct in tempOrder.products" :key="orderProduct.id">
              {{ orderProduct.product.title }} 數量：{{ orderProduct.qty }}
              {{ orderProduct.product.unit }}
            </li>
          </ul>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" data-bs-dismiss="modal">取消</button>
        <button type="button" class="btn btn-danger" @click="handleDeleteClick">確認刪除</button>
      </div>
    </div>
  </div>
</template>

<style></style>
