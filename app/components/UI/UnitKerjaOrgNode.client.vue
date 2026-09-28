<template>
  <div class="org-node-container" :class="{ 'has-children': node.children && node.children.length > 0 }">
    <div class="card-wrap">
      <article class="org-card" :class="`org-card-${Math.min(node.level || 0, 4)}`">
        <p class="org-name">{{ node.nama }}</p>
        <span class="level-badge" :class="`level-badge-${Math.min(node.level || 0, 4)}`">Level {{ node.level || 0 }}</span>
      </article>
    </div>

    <!-- Connector down to children -->
    <div v-if="node.children && node.children.length > 0" class="v-line" />

    <!-- Children row -->
    <div v-if="node.children && node.children.length > 0" class="children-row">
      <!-- Horizontal bar spanning all children -->
      <div class="h-bar" />

      <div
        v-for="child in node.children"
        :key="child.id"
        class="child-block"
      >
        <div class="v-line v-line-sm" />
        <UnitKerjaOrgNode :node="child" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import UnitKerjaOrgNode from './UnitKerjaOrgNode.client.vue'

defineOptions({
  name: 'UnitKerjaOrgNode'
})

export interface OrgChartNodeData {
  id: number
  nama: string
  level: number | null
  parentId: number | null
  children: OrgChartNodeData[]
}

const props = defineProps({
  node: {
    type: Object as PropType<OrgChartNodeData>,
    required: true
  }
})
</script>

<style scoped>
.org-node-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-wrap {
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.children-row {
  display: flex;
  gap: 0;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  padding-top: 1rem;
}

.h-bar {
  position: absolute;
  top: 0;
  left: calc(50% / var(--children-count, 2));
  right: calc(50% / var(--children-count, 2));
  height: 2px;
  background: #94a3b8;
}

/* Because CSS can't easily know children count dynamically without inline styles, 
   we'll use flex/padding instead for the horizontal bar. */
.children-row {
  display: flex;
  padding-top: 0;
}
.h-bar {
  display: none; /* Hide absolute bar, we will use pseudo elements on child-block */
}

.child-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0.5rem;
  position: relative;
}

/* Horizontal connectors for children */
.child-block::before {
  content: '';
  position: absolute;
  top: 0;
  right: 50%;
  border-top: 2px solid #94a3b8;
  width: 50%;
  height: 1rem;
}

.child-block::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  border-top: 2px solid #94a3b8;
  width: 50%;
  height: 1rem;
}

/* First child has no left connector */
.child-block:first-child::before {
  border-top: none;
}

/* Last child has no right connector */
.child-block:last-child::after {
  border-top: none;
}

/* Single child has no horizontal bar at all */
.child-block:first-child:last-child::before,
.child-block:first-child:last-child::after {
  border-top: none;
}

.v-line {
  width: 2px;
  height: 1.5rem;
  background: linear-gradient(to bottom, #94a3b8, #64748b);
  flex-shrink: 0;
}

.v-line-sm {
  height: 1rem;
  background: #94a3b8;
}

/* Cards */
.org-card {
  border-radius: 0.75rem;
  padding: 0.6rem 0.9rem;
  min-width: 12rem;
  max-width: 16rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: box-shadow 0.15s, transform 0.15s;
  background: #fff;
}

.org-card:hover {
  transform: translateY(-2px);
}

.org-card-0 {
  border: 1.5px solid #93c5fd;
  background: #eff6ff;
  box-shadow: 0 3px 10px rgba(29,78,216,0.1);
}

.org-card-1 {
  border: 1.5px solid #67e8f9;
  background: #ecfeff;
  box-shadow: 0 3px 10px rgba(8,145,178,0.08);
}

.org-card-2 {
  border: 1.5px solid #86efac;
  background: #f0fdf4;
  box-shadow: 0 3px 10px rgba(22,163,74,0.08);
}

.org-card-3 {
  border: 1.5px solid #fca5a5;
  background: #fef2f2;
  box-shadow: 0 3px 10px rgba(220,38,38,0.08);
}

.org-card-4 {
  border: 1.5px solid #d8b4fe;
  background: #faf5ff;
  box-shadow: 0 3px 10px rgba(147,51,234,0.08);
}

.org-name {
  margin: 0;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.88rem;
  line-height: 1.3;
  text-align: center;
}

.level-badge {
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.15rem 0.6rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  align-self: center;
}

.level-badge-0 { background: #1d4ed8; color: #fff; }
.level-badge-1 { background: #0891b2; color: #fff; }
.level-badge-2 { background: #16a34a; color: #fff; }
.level-badge-3 { background: #dc2626; color: #fff; }
.level-badge-4 { background: #9333ea; color: #fff; }

@media (max-width: 768px) {
  .org-card {
    min-width: 10rem;
  }
}
</style>
