<script setup>
import { toRefs } from 'vue';
const props = defineProps({
  tempCoupon: Object,
});
const { tempCoupon } = toRefs(props);

const emit = defineEmits(['deleteCoupon']);
const handleDeleteClick = () => {
  emit('deleteCoupon');
};
</script>
<template>
  <div class="modal-dialog" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-danger text-white">
        <h5 id="exampleModalLabel" class="modal-title">
          <span>刪除優惠券</span>
        </h5>
        <button
          type="button"
          class="btn-close white"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        是否刪除
        <strong class="text-danger">{{ tempCoupon.title }}</strong>
        優惠券(刪除後將無法恢復)。
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" data-bs-dismiss="modal">取消</button>
        <button type="button" class="btn btn-danger" @click="handleDeleteClick">確認刪除</button>
      </div>
    </div>
  </div>
</template>

<style></style>
