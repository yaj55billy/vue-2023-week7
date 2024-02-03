<script setup>
import { ref, toRefs } from 'vue';
const props = defineProps({
  tempCoupon: Object,
});
const { tempCoupon } = toRefs(props);

const emit = defineEmits(['updateCoupon']);
const handleUpdateClick = () => {
  emit('updateCoupon');
};
</script>
<template>
  <div class="modal-dialog modal-lg" role="document">
    <div class="modal-content border-0">
      <div class="modal-header bg-dark text-white">
        <h5 id="exampleModalLabel" class="modal-title">
          <span v-if="tempCoupon.id">編輯 {{ tempCoupon.title }}</span>
          <span v-else>新增優惠券</span>
        </h5>
        <button
          type="button"
          class="btn-close white"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body text-left">
        <div class="row">
          <div class="col-sm-12">
            <div class="form-group mb-3">
              <label for="couponTitle">優惠券名稱</label>
              <input
                id="couponTitle"
                v-model="tempCoupon.title"
                type="text"
                class="form-control"
                placeholder="請輸入名稱"
              />
            </div>
            <div class="form-group mb-3">
              <label for="couponCode">優惠碼</label>
              <input
                id="couponCode"
                v-model="tempCoupon.code"
                type="text"
                class="form-control"
                placeholder="請輸入優惠碼"
              />
            </div>
            <div class="form-group mb-3">
              <label for="couponPercent">折扣百分比</label>
              <input
                id="couponPercent"
                v-model.number="tempCoupon.percent"
                type="number"
                min="0"
                max="99"
                class="form-control"
                placeholder="請輸入折扣百分比"
              />
            </div>
            <div class="form-group mb-3">
              <label for="couponDeadline">到期日</label>
              <input
                id="couponDeadline"
                v-model="tempCoupon.due_date_normal"
                type="date"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <div class="form-check">
                <input
                  id="is_enabled"
                  v-model="tempCoupon.is_enabled"
                  class="form-check-input"
                  type="checkbox"
                  :true-value="1"
                  :false-value="0"
                />
                <label class="form-check-label" for="is_enabled">是否啟用</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn" data-bs-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary" @click="handleUpdateClick">確認</button>
      </div>
    </div>
  </div>
</template>

<style></style>
