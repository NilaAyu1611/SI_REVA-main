<template>
  <div class="space-y-4">
    <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 text-center">
        <h1 class="text-lg font-semibold text-slate-800">Master User</h1>
      </div>

      <div class="px-5 py-3 border-b border-slate-200 bg-white">
        <div class="flex w-full justify-end">
          <button
            type="button"
            class="bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg px-4 py-2 inline-flex items-center gap-2 text-sm shadow"
          >
            <IconPlus :size="16" :stroke="'2'" />
            Input User
          </button>
        </div>
      </div>

      <div v-if="loading" class="p-6 text-sm text-slate-500">Memuat data...</div>
      <div v-else-if="errorMessage" class="p-6 text-sm text-red-600">{{ errorMessage }}</div>
      <div v-else class="p-5">
        <Table
          :columns="columns"
          :data="tableRows"
          rowKey="id"
          :showSearch="true"
          :showPagination="true"
          :pageSize="10"
        >
          <template #cell-aksi="{ row }">
            <div class="flex items-center justify-center gap-2">
              <button
                type="button"
                :aria-label="`Edit ${row.nama}`"
                title="Edit"
                class="action-btn action-btn-edit"
              >
                <IconPencil :size="16" :stroke="'2'" />
              </button>
              <button
                type="button"
                :aria-label="`Hapus ${row.nama}`"
                title="Hapus"
                class="action-btn action-btn-delete"
              >
                <IconTrash :size="16" :stroke="'2'" />
              </button>
            </div>
          </template>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed } from 'vue';
import useSWRV from 'swrv';
import { IconPencil, IconTrash, IconPlus } from '@tabler/icons-vue';
import Table from '@/components/UI/Table.vue';

interface UserApi {
  id: number;
  created_at: string | null;
  unit_kerja: string | null;
  username: string | null;
  password: string | null;
  role_id: number | null;
  alias: string | null;
  role: string | null;
}

interface UserRow {
  id: number;
  nama: string;
  username: string;
  role_id: number | string;
  role: string;
  unit_kerja: string;
  created_at: string;
  aksi: string;
}

const columns = [
  { key: 'id', label: 'ID', className: 'text-center w-16' },
  { key: 'nama', label: 'Nama' },
  { key: 'username', label: 'Username' },
  { key: 'role_id', label: 'Role ID', className: 'text-center w-24' },
  { key: 'role', label: 'Role', className: 'text-center w-28' },
  { key: 'unit_kerja', label: 'Unit Kerja' },
  { key: 'created_at', label: 'Dibuat', className: 'w-44' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
];

const dummyRows: UserRow[] = [
  {
    id: 1,
    nama: 'Admin',
    username: 'admin',
    role_id: 1,
    role: 'admin',
    unit_kerja: 'Sekretariat',
    created_at: '2026-04-01 10:00:00',
    aksi: '',
  },
  {
    id: 2,
    nama: 'User B',
    username: 'userb',
    role_id: 2,
    role: 'operator',
    unit_kerja: 'Pusat Data',
    created_at: '2026-03-15 08:30:00',
    aksi: '',
  },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());
const { data, error, isValidating } = useSWRV<UserApi[]>('/api/users', fetcher);

const loading = computed(() => isValidating.value && !data.value);

const errorMessage = computed(() => {
  if (!error.value) return '';
  return error.value instanceof Error ? error.value.message : 'Gagal memuat data user.';
});

function formatDate(value: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const tableRows = computed<UserRow[]>(() => {
  const rowsFromApi = Array.isArray(data.value)
    ? data.value.map((item) => ({
        id: item.id,
        nama: item.alias || item.username || '-',
        username: item.username || '-',
        role_id: item.role_id ?? '-',
        role: item.role || '-',
        unit_kerja: item.unit_kerja || '-',
        created_at: formatDate(item.created_at),
        aksi: '',
      }))
    : [];

  return rowsFromApi.length ? rowsFromApi : dummyRows;
});
</script>

<style scoped>
.action-btn {
  height: 1.9rem;
  width: 1.9rem;
  border-radius: 0.5rem;
  border: 1px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.action-btn-edit {
  color: #1d4ed8;
  background: #dbeafe;
  border-color: #bfdbfe;
}

.action-btn-edit:hover {
  color: #fff;
  background: #2563eb;
  border-color: #2563eb;
}

.action-btn-delete {
  color: #b91c1c;
  background: #fee2e2;
  border-color: #fecaca;
}

.action-btn-delete:hover {
  color: #fff;
  background: #dc2626;
  border-color: #dc2626;
}
</style>
