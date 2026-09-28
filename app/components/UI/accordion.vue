<template>
  <div class="accordion-item" :class="{ 'is-open': isOpen }">
    <button 
      type="button" 
      @click="toggle" 
      class="accordion-header"
      :aria-expanded="isOpen"
    >
      <span class="accordion-title">{{ title }}</span>
      <div class="accordion-icon">
        <IconChevronDown :size="18" stroke="3" />
      </div>
    </button>
    
    <div 
      class="accordion-content" 
      :style="contentStyle"
      ref="contentRef"
    >
      <div class="accordion-body">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { IconChevronDown } from '@tabler/icons-vue';

interface Props {
  title: string;
  defaultOpen?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  defaultOpen: false
});

const isOpen = ref(props.defaultOpen);
const contentRef = ref<HTMLElement | null>(null);

const toggle = () => {
  isOpen.value = !isOpen.value;
};

const contentStyle = computed(() => {
  if (!isOpen.value) return { maxHeight: '0px' };
  return { maxHeight: contentRef.value?.scrollHeight + 'px' };
});
</script>

<style scoped>
.accordion-item {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-item.is-open {
  border-color: #3b82f6;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.05);
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s ease;
}

.accordion-header:hover {
  background: #f8fafc;
}

.accordion-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1e293b;
  transition: color 0.2s ease;
}

.accordion-item.is-open .accordion-title {
  color: #2563eb;
}

.accordion-icon {
  color: #94a3b8;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), color 0.3s ease;
}

.accordion-item.is-open .accordion-icon {
  transform: rotate(180deg);
  color: #2563eb;
}

.accordion-content {
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-body {
  padding: 0 1.5rem 1.5rem 1.5rem;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.6;
}
</style>
