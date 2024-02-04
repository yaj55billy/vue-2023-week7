<script setup>
import { onMounted, ref } from 'vue';
import bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
import ProductModal from '@/components/admin/ProductModal.vue';
import DelProductModal from '@/components/admin/DelProductModal.vue';
import Pagination from '@/components/Pagination.vue';
import { useLoaderStore } from '@/stores/useLoaderStore.js';
import {
  apiGetAdminProducts,
  apiAddAdminProduct,
  apiEditAdminProduct,
  apiDeleteAdminProduct,
  apiUploadAdminImage,
} from '@/utils/api.js';
import { SwalHandle } from '@/utils/sweetalert2.js';

const loaderStore = useLoaderStore();

let productModalHandle = null;
let delProductModalHandle = null;

const products = ref([]);
const tempProduct = ref({ imagesUrl: [] });
const pagination = ref({});
const productModalRef = ref(null);
const delProductModalRef = ref(null);
const isNew = ref(true);
const fileUpLoading = ref(false);

const getProducts = (page = 1) => {
  loaderStore.changeIsLoading(true);
  apiGetAdminProducts(page)
    .then((res) => {
      products.value = res.data.products;
      pagination.value = res.data.pagination;
      loaderStore.changeIsLoading(false);
    })
    .catch((error) => {
      console.log(error);
      loaderStore.changeIsLoading(false);
    });
};

const openModal = (status, product) => {
  if (status === 'new') {
    isNew.value = true;
    tempProduct.value = {
      imagesUrl: [],
    };
    productModalHandle.show();
  } else {
    isNew.value = false;
    tempProduct.value = { ...product };
    status === 'edit' ? productModalHandle.show() : delProductModalHandle.show();
  }
};

const updateProduct = () => {
  const data = { data: tempProduct.value };
  const tempProductId = tempProduct.value.id;

  if (isNew.value === true) {
    apiAddAdminProduct(data)
      .then(() => {
        getProducts();
        SwalHandle.showSuccessMsg('產品新增成功～');
        productModalHandle.hide();
      })
      .catch((error) => {
        SwalHandle.showErrorMsg(error.response.data.message);
        productModalHandle.hide();
      });
  } else {
    apiEditAdminProduct(data, tempProductId)
      .then(() => {
        getProducts();
        SwalHandle.showSuccessMsg('產品編輯成功～');
        productModalHandle.hide();
      })
      .catch((error) => {
        SwalHandle.showErrorMsg(error.response.data.message);
        productModalHandle.hide();
      });
  }
};

const deleteProduct = () => {
  const tempProductId = tempProduct.value.id;
  apiDeleteAdminProduct(tempProductId)
    .then(() => {
      SwalHandle.showSuccessMsg('產品刪除成功～');
      getProducts();
      delProductModalHandle.hide();
    })
    .catch((error) => {
      SwalHandle.showErrorMsg(error.response.data.message);
      delProductModalHandle.hide();
    });
};

const addInitImages = () => {
  tempProduct.value.imagesUrl = [];
  tempProduct.value.imagesUrl.push('');
};

const productModalChildRef = ref(null);

// 上傳圖片
const uploadFile = () => {
  fileUpLoading.value = true;
  const catchFile = productModalChildRef.value.customFileRef.files[0];
  const fileData = new FormData();
  fileData.append('file-to-upload', catchFile);

  apiUploadAdminImage(fileData)
    .then((res) => {
      SwalHandle.showSuccessMsg('圖片上傳成功～');
      tempProduct.value = {
        ...tempProduct.value,
        imageUrl: res.data.imageUrl,
      };
      productModalChildRef.value.customFileRef.value = '';
      fileUpLoading.value = false;
    })
    .catch((error) => {
      SwalHandle.showErrorMsg('檔案上傳失敗，請再檢查是不是檔案大小超過 3MB');
      fileUpLoading.value = false;
    });
};

onMounted(() => {
  getProducts();
  productModalHandle = new bootstrap.Modal(productModalRef.value, {});
  delProductModalHandle = new bootstrap.Modal(delProductModalRef.value, {});
});
</script>
<template>
  <div class="mt-4">
    <h2>產品列表</h2>
    <div class="text-end mt-sm-2 mt-4">
      <button type="button" class="btn btn-primary" @click="openModal('new')">建立新的產品</button>
    </div>
    <table class="table-admin table-rwd mt-3">
      <thead>
        <tr>
          <th width="160">分類</th>
          <th width="780">產品名稱</th>
          <th width="100">原價</th>
          <th width="100">售價</th>
          <th width="160">是否啟用</th>
          <th width="140">編輯</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td data-th="分類">{{ product.category }}</td>
          <td data-th="產品名稱">{{ product.title }}</td>
          <td data-th="原價" v-thousands="product.origin_price"></td>
          <td data-th="售價" v-thousands="product.price"></td>
          <td data-th="是否啟用">
            <span v-if="product.is_enabled" class="text-success">啟用</span>
            <span v-else>未啟用</span>
          </td>
          <td data-th="編輯">
            <div class="btn-group">
              <button
                type="button"
                class="btn btn-outline-primary btn-sm"
                @click="openModal('edit', product)"
              >
                編輯
              </button>
              <button
                type="button"
                class="btn btn-outline-danger btn-sm"
                @click="openModal('delete', product)"
              >
                刪除
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination :pagination="pagination" @updatePage="getProducts"></Pagination>
  </div>
  <div
    ref="productModalRef"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <ProductModal
      ref="productModalChildRef"
      :tempProduct="tempProduct"
      :fileUpLoading="fileUpLoading"
      @updateProduct="updateProduct"
      @addInitImages="addInitImages"
      @uploadFile="uploadFile"
    />
  </div>
  <div
    ref="delProductModalRef"
    class="modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <DelProductModal :temp-product="tempProduct" @deleteProduct="deleteProduct" />
  </div>
</template>

<style></style>
