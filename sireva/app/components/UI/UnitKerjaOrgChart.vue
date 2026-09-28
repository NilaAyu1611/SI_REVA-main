<template>
  <div>
    <div v-if="loading" class="p-8 text-center text-sm text-slate-500">Memuat struktur organisasi...</div>
    <div v-else-if="errorMsg" class="p-8 text-center text-sm text-red-500">{{ errorMsg }}</div>

    <div v-else class="org-chart-container">
      <!-- Root nodes -->
      <div class="root-row">
        <div
          v-for="root in tree"
          :key="root.id"
          class="root-block"
        >
          <!-- Level 0 card -->
          <div class="card-wrap">
            <article class="org-card org-card-0">
              <p class="org-name">{{ root.nama }}</p>
              <span class="level-badge level-badge-0">Level 0</span>
            </article>
          </div>

          <!-- Connector down to level-1 row -->
          <div v-if="root.children.length" class="v-line" />

          <!-- Level 1 row -->
          <div v-if="root.children.length" class="children-row">
            <!-- Horizontal bar spanning all children -->
            <div class="h-bar" />

            <div
              v-for="child1 in root.children"
              :key="child1.id"
              class="child-block"
            >
              <!-- Connector into level-1/2 card; dashed when child is level 2 directly under root -->
              <div class="v-line v-line-sm" :class="{ 'v-line--dashed': child1.level === 2 }" />

              <div class="card-wrap">
                <article class="org-card" :class="child1.level === 2 ? 'org-card-2' : 'org-card-1'">
                  <p class="org-name">{{ child1.nama }}</p>
                  <span class="level-badge" :class="child1.level === 2 ? 'level-badge-2' : 'level-badge-1'">Level {{ child1.level }}</span>
                </article>
              </div>

              <!-- Connector down to level-2 row -->
              <div v-if="child1.children.length" class="v-line" />

              <!-- Level 2 row -->
              <div v-if="child1.children.length" class="children-row">
                <div class="h-bar" :class="{ 'h-bar--dashed': child1.level === 2 }" />

                <div
                  v-for="child2 in child1.children"
                  :key="child2.id"
                  class="child-block"
                >
                  <div class="v-line v-line-sm" :class="{ 'v-line--dashed': child1.level === 2 }" />
                  <article class="org-card org-card-2">
                    <p class="org-name">{{ child2.nama }}</p>
                    <span class="level-badge level-badge-2">Level {{ child2.level }}</span>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import useSWRV from 'swrv'

export interface OrgChartNode {
  id: number
  nama: string
  level: number | null
  parentId: number | null
  children: OrgChartNode[]
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const { data, error, isValidating } = useSWRV<OrgChartNode[]>('/api/organisasi', fetcher)

const loading = computed(() => isValidating.value && !data.value)

const errorMsg = computed(() => {
  if (!error.value) return ''
  return error.value instanceof Error ? error.value.message : 'Gagal memuat data organisasi.'
})

const tree = computed<OrgChartNode[]>(() => (Array.isArray(data.value) ? data.value : []))
</script>

<style scoped>
/* ── Container ───────────────────────────── */
.org-chart-container {
  overflow-x: auto;
  padding: 1rem 0.5rem 1.5rem;
}

.root-row {
  display: flex;
  gap: 3rem;
  justify-content: center;
  align-items: flex-start;
}

.root-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ── Vertical lines ──────────────────────── */
.v-line {
  width: 2px;
  height: 1.6rem;
  background: linear-gradient(to bottom, #94a3b8, #64748b);
  flex-shrink: 0;
}

.v-line-sm {
  height: 1rem;
}

.v-line--dashed {
  background: none;
  border-left: 2px dashed #94a3b8;
  width: 0;
}

/* ── Horizontal bar + children row ──────── */
.children-row {
  display: flex;
  gap: 0;
  justify-content: center;
  align-items: flex-start;
  position: relative;
}

.h-bar {
  position: absolute;
  top: 0;
  left: 1rem;
  right: 1rem;
  height: 2px;
  background: #94a3b8;
}

.h-bar--dashed {
  background: none;
  border-top: 2px dashed #94a3b8;
  height: 0;
}

.child-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0.6rem;
}

/* ── Card wrap ───────────────────────────── */
.card-wrap {
  display: flex;
  justify-content: center;
}

/* ── Cards ───────────────────────────────── */
.org-card {
  border-radius: 0.75rem;
  padding: 0.6rem 0.9rem;
  min-width: 13rem;
  max-width: 16rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: box-shadow 0.15s, transform 0.15s;
}

.org-card:hover {
  transform: translateY(-2px);
}

.org-card-0 {
  border: 1.5px solid #93c5fd;
  background: #eff6ff;
  box-shadow: 0 3px 10px rgba(29,78,216,0.1);
}

.org-card-0:hover { box-shadow: 0 6px 18px rgba(29,78,216,0.18); }

.org-card-1 {
  border: 1.5px solid #67e8f9;
  background: #ecfeff;
  box-shadow: 0 3px 10px rgba(8,145,178,0.08);
}

.org-card-1:hover { box-shadow: 0 6px 18px rgba(8,145,178,0.15); }

.org-card-2 {
  border: 1.5px solid #86efac;
  background: #f0fdf4;
  box-shadow: 0 3px 10px rgba(22,163,74,0.08);
}

.org-card-2:hover { box-shadow: 0 6px 18px rgba(22,163,74,0.15); }

.level-badge {
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.15rem 0.6rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  align-self: flex-start;
}

.level-badge-0 {
  background: #1d4ed8;
  color: #fff;
}

.level-badge-1 {
  background: #0891b2;
  color: #fff;
}

.level-badge-2 {
  background: #16a34a;
  color: #fff;
}

.level-count {
  font-size: 0.72rem;
  font-weight: 500;
  color: #64748b;
}

.level-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.level-empty {
  font-size: 0.82rem;
  color: #94a3b8;
  padding: 0.4rem 0;
}

/* ── Cards ────────────────────────────────── */
.org-card {
  border-radius: 0.75rem;
  padding: 0.7rem 1rem;
  min-width: 15rem;
  transition: box-shadow 0.15s ease, transform 0.15s ease;
}

.org-card:hover {
  transform: translateY(-2px);
}

.org-card-0 {
  border: 1px solid #93c5fd;
  background: #fff;
  box-shadow: 0 2px 8px rgba(29, 78, 216, 0.08);
}

.org-card-0:hover {
  box-shadow: 0 6px 16px rgba(29, 78, 216, 0.15);
}

.org-card-1 {
  border: 1px solid #67e8f9;
  background: #fff;
  box-shadow: 0 2px 8px rgba(8, 145, 178, 0.07);
}

.org-card-1:hover {
  box-shadow: 0 6px 16px rgba(8, 145, 178, 0.14);
}

.org-card-2 {
  border: 1px solid #86efac;
  background: #fff;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.07);
}

.org-card-2:hover {
  box-shadow: 0 6px 16px rgba(22, 163, 74, 0.14);
}

.org-name {
  margin: 0;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.88rem;
  line-height: 1.4;
}

.org-meta {
  margin: 0.35rem 0 0;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.meta-id {
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 500;
}

.meta-parent {
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 500;
  font-style: italic;
}

/* ── Responsive ───────────────────────────── */
@media (max-width: 768px) {
  .org-card {
    min-width: 100%;
  }

  .level-row {
    flex-direction: column;
  }
}
</style>
