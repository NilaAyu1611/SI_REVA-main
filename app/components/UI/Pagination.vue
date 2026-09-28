<template>
  <div class="w-full">
    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
      <p class="text-xs font-medium text-slate-500">Halaman {{ currentPage }} dari {{ totalPages }}</p>
      <Pagination
        v-model="currentPage"
        :total-pages="totalPages"
        :page-size="pageSize"
        :page-size-options="pageSizeOptions"
        @page-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Pagination } from '@idds/vue';

const props = withDefaults(defineProps<{
  modelValue: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions?: number[];
}>(), {
  pageSizeOptions: () => [10, 20, 50, 100],
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'page-size-change', value: number): void;
}>();

const currentPage = computed({
  get: () => props.modelValue,
  set: (value: number) => emit('update:modelValue', value),
});

const pageSize = computed(() => props.pageSize);

const totalPages = computed(() => props.totalPages);
const pageSizeOptions = computed(() => props.pageSizeOptions);

const handlePageSizeChange = (newPageSize: number) => {
  emit('page-size-change', newPageSize);
};
</script>
