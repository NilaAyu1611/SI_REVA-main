<template>
  <div class="relative inline-block" ref="refDropdown">
    <!-- Main Toggle Button -->
    <button
      type="button"
      @click="open = !open"
      class="flex items-center justify-between gap-3 px-4 py-2 bg-white border border-slate-200 hover:border-blue-400 text-slate-700 text-sm font-bold rounded-xl transition-all shadow-sm focus:ring-4 focus:ring-blue-100 focus:outline-none z-10 min-w-[160px]"
    >
      <div class="flex items-center gap-2.5 overflow-hidden">
        <component :is="icon" :size="18" class="flex-shrink-0 text-slate-400" />
        <span class="truncate">{{ currentLabel || placeholder }}</span>
      </div>
      <IconChevronDown :size="16" :class="['transition-transform shrink-0 text-slate-400', open ? 'rotate-180' : '']" />
    </button>

    <!-- Dropdown List -->
    <div 
      v-if="open" 
      class="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-200 py-1.5 z-[999] max-h-72 overflow-y-auto min-w-[200px]"
    >
      <button
        v-for="opt in normalizedOptions"
        :key="String(opt.value)"
        type="button"
        @click="select(opt)"
        class="w-full text-left px-4 py-2.5 text-[13px] hover:bg-slate-50 flex items-center justify-between transition-colors"
        :class="opt.value === modelValue ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-700 font-medium'"
      >
        <span class="truncate">{{ opt.label }}</span>
        <IconCheck v-if="opt.value === modelValue" :size="14" stroke-width="3" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { IconChevronDown, IconCheck } from '@tabler/icons-vue';

interface Option {
  value: any;
  label: string;
}

const props = defineProps({
  icon: { type: Object, required: true },
  modelValue: { type: [String, Number, null] as any, required: true },
  options: { type: Array as () => (string | Option)[], required: true },
  placeholder: { type: String, default: 'Pilih...' }
});

const emit = defineEmits(['update:modelValue']);

const open = ref(false);
const refDropdown = ref<HTMLElement | null>(null);

const normalizedOptions = computed<Option[]>(() => {
  return props.options.map(opt => {
    if (typeof opt === 'string') {
      return { value: opt, label: opt };
    }
    return opt;
  });
});

const currentLabel = computed(() => {
  const found = normalizedOptions.value.find(opt => opt.value === props.modelValue);
  return found ? found.label : '';
});

const select = (opt: Option) => {
  emit('update:modelValue', opt.value);
  open.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (refDropdown.value && !refDropdown.value.contains(event.target as Node)) {
    open.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
