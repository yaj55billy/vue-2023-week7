<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { SwalHandle } from '@/utils/sweetalert2.js';
import { useLoaderStore } from '@/stores/useLoaderStore.js';
import { apiAdminBase, apiAdminCheck, apiSignOut } from '@/utils/api.js';
const loaderStore = useLoaderStore();
const router = useRouter();
const checkSuccess = ref(false);

const checkAdmin = () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');

  apiAdminBase.defaults.headers.common['Authorization'] = token;
  if (token) {
    apiAdminCheck()
      .then(() => {
        checkSuccess.value = true;
      })
      .catch(function (error) {
        checkSuccess.value = false;
        SwalHandle.showErrorMsg('請重新登入～');
        router.push('/login');
      });
  } else {
    SwalHandle.showErrorMsg('請重新登入～');
    router.push('/login');
  }
};

const signOut = () => {
  apiSignOut()
    .then(() => {
      SwalHandle.showSuccessMsg('您已登出～');
      router.push('/');
    })
    .catch((error) => {
      console.log(error);
    });
};

onMounted(() => {
  checkAdmin();
});
</script>

<template>
  <Loading :active="loaderStore.isLoading"></Loading>
  <nav class="navbar navbar-dark fixed-top bg-dark flex-md-nowrap shadow navbar-expand px-4">
    <a href="#" class="navbar-brand col-sm-3 col-md-2 mr-0 active text-left">後台管理頁面</a>
    <div class="ms-auto">
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <RouterLink to="/" class="nav-link active">回首頁</RouterLink>
        </li>
        <li class="nav-item text-nowrap">
          <a href="#" class="nav-link" @click.prevent="signOut">登出</a>
        </li>
      </ul>
    </div>
  </nav>
  <div class="page-admin container-fluid">
    <div class="row">
      <nav class="col-lg-2 col-md-3 nav flex-column bg-light sidebar">
        <div class="mt-2">
          <RouterLink to="/admin/products" class="nav-link py-2 font-weight-bold">
            產品列表
          </RouterLink>
          <RouterLink to="/admin/coupons" class="nav-link py-2 font-weight-bold">
            優惠券列表
          </RouterLink>
        </div>
      </nav>

      <div class="col-lg-10 col-md-9 px-4">
        <RouterView v-if="checkSuccess"></RouterView>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.router-link-active {
  color: #4f764b;
  &:hover {
    color: #4f764b;
  }
}
</style>
