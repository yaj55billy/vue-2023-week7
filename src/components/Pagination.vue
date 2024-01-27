<script setup>
const props = defineProps({
  pagination: Object,
});

const emit = defineEmits(['updatePage']);

const nowPage = (page) => {
  emit('updatePage', page);
};

// pagination: {
//   count: 14
//   current_page: 1
//   links: {}
//   per_page: 25
//   total: 14
//   total_pages: 1
// }
</script>

<template>
  <nav aria-label="Page navigation">
    <ul class="pagination mt-4">
      <li
        class="page-item"
        :disabled="pagination.current_page - 1 === 0"
        :class="{ disabled: pagination.current_page - 1 === 0 }"
      >
        <a
          class="page-link"
          href="#"
          aria-label="Previous"
          @click.prevent="nowPage(pagination.current_page - 1)"
        >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li
        class="page-item ms-2"
        v-for="(page, index) in pagination.total_pages"
        :key="'page' + index"
        :class="{ active: page === pagination.current_page }"
      >
        <a class="page-link" href="#" @click.prevent="nowPage(page)">{{ page }} </a>
      </li>
      <li
        class="page-item ms-2"
        :disabled="pagination.current_page === pagination.total_pages"
        :class="{ disabled: pagination.current_page === pagination.total_pages }"
      >
        <a
          class="page-link"
          href="#"
          aria-label="Next"
          @click.prevent="nowPage(pagination.current_page + 1)"
        >
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>
