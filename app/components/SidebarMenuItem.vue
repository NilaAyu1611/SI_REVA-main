<template>
  <div>
    <NuxtLink
      v-if="item.href && !item.children"
      :to="item.href"
      :class="[
        'group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-base font-medium',
        isActive(item.href)
          ? 'bg-[#4472a6] text-white rounded-lg shadow-md'
          : 'text-blue-100/80 hover:bg-[#4472a6] hover:text-white rounded-lg'
      ]"
    >
      <span :class="[
        'flex items-center justify-center transition-colors duration-200',
        isActive(item.href)
          ? 'text-white'
          : 'text-blue-300/70 group-hover:text-blue-200'
      ]">
        <component :is="iconMap[item.icon]" :size="20" :stroke="1.5" />
      </span>
      {{ item.label }}
    </NuxtLink>

    <div v-if="item.children && item.children.length" :class="isOpen ? 'mb-2' : ''">
      <div
        @click="isOpen = !isOpen"
        :class="[
          'flex items-center justify-between gap-3 px-3 py-2.5 text-base font-medium cursor-pointer select-none transition-colors duration-200',
          isParentActive(item)
            ? 'text-white bg-[#4472a6] rounded-lg'
            : 'text-blue-100/80 hover:bg-[#4472a6] hover:text-white rounded-lg'
        ]"
      >
        <div class="flex items-center gap-3 min-w-0">
          <span :class="isParentActive(item) ? 'text-white' : 'text-blue-300/80'">
            <component :is="iconMap[item.icon]" :size="20" :stroke="1.5" />
          </span>
          <span class="truncate">{{ item.label }}</span>
        </div>
        <component 
          :is="iconMap['IconChevronDown']" 
          :size="16" 
          :stroke="2" 
          :class="[
            'transition-transform duration-200',
            isOpen ? 'rotate-180' : '',
            isParentActive(item) ? 'text-blue-100' : 'text-blue-300/70'
          ]" 
        />
      </div>
      <div v-show="isOpen" class="pb-2 px-2 mt-2">
        <NuxtLink
          v-for="child in item.children"
          :key="child.href"
          :to="child.href"
          :class="[
            'group flex items-center gap-2 pl-6 pr-3 py-2 rounded-lg text-base transition-all duration-200',
            isActive(child.href)
              ? 'bg-[#4472a6] text-white rounded-lg shadow-sm'
              : 'text-blue-100/80 hover:bg-[#4472a6] hover:text-white rounded-lg'
          ]"
        >
          <span :class="[
            'flex items-center justify-center',
            isActive(child.href)
              ? 'text-white'
              : 'text-blue-300/70 group-hover:text-blue-200'
          ]">
            <component :is="iconMap[child.icon]" :size="16" :stroke="1.8" />
          </span>
          <span class="leading-snug">{{ child.label }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, watch, computed } from 'vue';
import type { PropType } from 'vue';

interface SidebarMenuChildItem {
  label: string;
  href: string;
  icon: string;
}
interface SidebarMenuItem {
  label: string;
  href?: string;
  children?: SidebarMenuChildItem[];
  icon: string;
  optional?: boolean;
}

const props = defineProps({
  item: {
    type: Object as PropType<SidebarMenuItem>,
    required: true,
    default: () => ({ label: '', icon: '' })
  },
  iconMap: {
    type: Object as PropType<Record<string, any>>,
    required: true,
    default: () => ({})
  },
  activePath: {
    type: String,
    required: true,
    default: ''
  }
});
const route = useRoute();
function isActive(href: string) {
  return props.activePath === href || props.activePath?.startsWith(`${href}/`);
}
function isParentActive(item: SidebarMenuItem) {
  if (item.href && isActive(item.href)) return true;
  if (item.children) return item.children.some(child => isActive(child.href));
  return false;
}

const isParentInitiallyActive = computed(() => props.item.children ? isParentActive(props.item) : false);
const isOpen = ref(isParentInitiallyActive.value);

watch(() => props.activePath, () => {
  if (isParentActive(props.item)) {
    isOpen.value = true;
  }
});
</script>
