<template>
  <div class="alert-container" :class="[`alert-${variant}`]">
    <div class="alert-icon">
      <component :is="icon" :size="20" stroke="2.5" />
    </div>
    <div class="alert-content">
      <h4 v-if="title" class="alert-title">{{ title }}</h4>
      <p v-if="message" class="alert-message">{{ message }}</p>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { 
  IconInfoCircle, 
  IconCircleCheck, 
  IconAlertTriangle, 
  IconAlertCircle 
} from '@tabler/icons-vue';

interface Props {
  variant?: 'neutral' | 'info' | 'success' | 'caution' | 'critical';
  title?: string;
  message?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'info'
});

const icon = computed(() => {
  switch (props.variant) {
    case 'success': return IconCircleCheck;
    case 'caution': return IconAlertTriangle;
    case 'critical': return IconAlertCircle;
    case 'neutral':
    case 'info':
    default: return IconInfoCircle;
  }
});
</script>

<style scoped>
.alert-container {
  display: flex;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.alert-icon {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-size: 0.875rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.alert-message {
  font-size: 0.8125rem;
  line-height: 1.5;
  opacity: 0.9;
}

/* Variant Styles */
.alert-neutral {
  background-color: #f8fafc;
  border-color: #e2e8f0;
  color: #475569;
}
.alert-neutral .alert-icon { color: #64748b; }
.alert-neutral .alert-title { color: #1e293b; }

.alert-info {
  background-color: #eff6ff;
  border-color: #dbeafe;
  color: #2563eb;
}
.alert-info .alert-icon { color: #3b82f6; }
.alert-info .alert-title { color: #1d4ed8; }

.alert-success {
  background-color: #ecfdf5;
  border-color: #d1fae5;
  color: #059669;
}
.alert-success .alert-icon { color: #10b981; }
.alert-success .alert-title { color: #065f46; }

.alert-caution {
  background-color: #fffbeb;
  border-color: #fef3c7;
  color: #d97706;
}
.alert-caution .alert-icon { color: #f59e0b; }
.alert-caution .alert-title { color: #92400e; }

.alert-critical {
  background-color: #fff1f2;
  border-color: #ffe4e6;
  color: #e11d48;
}
.alert-critical .alert-icon { color: #f43f5e; }
.alert-critical .alert-title { color: #9f1239; }
</style>
