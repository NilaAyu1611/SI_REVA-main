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
            @click="openModal()"
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
          :searchKeys="tableSearchKeys"
        >
          <template #cell-aksi="{ row }">
            <div class="flex items-center justify-center gap-2">
              <button
                type="button"
                @click="openModal(row)"
                :aria-label="`Edit ${row.nama}`"
                title="Edit"
                class="action-btn action-btn-edit"
              >
                <IconPencil :size="16" :stroke="'2'" />
              </button>
              <button
                type="button"
                @click="deleteUser(row.id)"
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

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden">
        <div class="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-slate-800">{{ isEdit ? 'Edit User' : 'Input User' }}</h2>
          <button @click="closeModal" class="text-slate-400 hover:text-slate-600">&times;</button>
        </div>
        <div class="p-5">
          <form @submit.prevent="saveUser" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Username</label>
              <input v-model="formData.username" type="text" required class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Password {{ isEdit ? '(Kosongkan jika tidak diubah)' : '' }}</label>
              <input v-model="formData.password" type="password" :required="!isEdit" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Nama / Alias</label>
              <input v-model="formData.alias" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Unit Kerja</label>
              <input v-model="formData.unit_kerja" type="text" class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <!-- Role Dropdown -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Role</label>
              <div class="relative">
                <select 
                  v-model="formData.role" 
                  @change="onRoleChange"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 appearance-none pr-9 bg-white"
                >
                  <option value="" disabled>-- Pilih Role --</option>
                  <option v-for="opt in roleOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
                <span class="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
                </span>
              </div>
              <!-- Role description hint -->
              <p v-if="selectedRoleDesc" class="mt-1.5 text-xs text-slate-500 bg-slate-50 border border-slate-100 rounded-md px-2.5 py-1.5">{{ selectedRoleDesc }}</p>
            </div>

            <!-- Role ID (auto-filled, read-only) -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Role ID <span class="text-xs text-slate-400 font-normal">(terisi otomatis)</span></label>
              <input 
                :value="formData.role_id ?? ''" 
                type="text" 
                readonly 
                class="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed" 
              />
            </div>
            <div class="flex justify-end gap-2 mt-6">
              <button type="button" @click="closeModal" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium text-sm transition-colors">Batal</button>
              <button type="submit" :disabled="isSaving" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50">
                {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'dashboard' })

import { computed, ref, reactive } from 'vue';
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
  no: number;
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
  { key: 'no', label: 'No.', className: 'text-center w-16' },
  { key: 'nama', label: 'Nama' },
  { key: 'username', label: 'Username' },
  { key: 'unit_kerja', label: 'Unit Kerja' },
  { key: 'aksi', label: 'Aksi', className: 'text-center w-24' },
];

// Keys that should be searched when user types in the search box
const tableSearchKeys = ['nama', 'username', 'unit_kerja'];

const dummyRows: UserRow[] = [
  {
    no: 1,
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
    no: 2,
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
const { data, error, pending, refresh } = useFetch('/api/users', { lazy: true, default: () => [] });

const loading = computed(() => pending.value && !data.value);

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
  if (!Array.isArray(data.value)) {
    return dummyRows;
  }

  // Create a copy of the data from API
  let rowsFromApi = [...data.value];

  // Map to UserRow format first so we can sort by 'nama'
  let mappedRows = rowsFromApi.map((item) => ({
    no: 0, // placeholder, will be updated after sort
    id: item.id,
    nama: item.alias || item.username || '-',
    username: item.username || '-',
    role_id: item.role_id ?? '-',
    role: item.role || '-',
    unit_kerja: item.unit_kerja || '-',
    created_at: formatDate(item.created_at),
    aksi: '',
  }));

  // Sort by 'nama' alphabetically ascending
  mappedRows.sort((a, b) => a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' }));

  // Assign sequence number based on sorted order
  mappedRows = mappedRows.map((item, index) => ({
    ...item,
    no: index + 1
  }));

  return mappedRows.length ? mappedRows : dummyRows;
});

// Fast id-keyed Map of raw API data for reliable openModal lookup
const rawDataById = computed<Map<number, UserApi>>(() => {
  const map = new Map<number, UserApi>();
  if (Array.isArray(data.value)) {
    for (const item of data.value) {
      if (item.id != null) map.set(Number(item.id), item);
    }
  }
  return map;
});

// Role options with ID, label, and description
const roleOptions = [
  { value: 'super_admin', id: 1, label: 'Super Admin (Role ID: 1)', desc: 'Akses penuh ke seluruh fitur, termasuk Master Data, Perencanaan, Pemantauan, dan Dashboard.' },
  { value: 'admin',       id: 2, label: 'Admin / Eselon 1 (Role ID: 2)', desc: 'Akses ke fitur Perencanaan, Pemantauan, Cascading Kinerja, dan Laporan tingkat Eselon 1.' },
  { value: 'user',        id: 3, label: 'User / Unit Kerja (Role ID: 3)', desc: 'Akses terbatas ke perencanaan dan pemantauan pada level unit kerja masing-masing.' },
  { value: 'verifikator', id: null, label: 'Verifikator', desc: 'Bertugas melakukan verifikasi data yang diinputkan oleh unit kerja.' },
  { value: 'kepala',      id: null, label: 'Kepala', desc: 'Akses monitoring dan persetujuan sebagai Kepala unit.' },
];

const selectedRoleDesc = computed(() => {
  const opt = roleOptions.find(o => o.value === formData.role);
  return opt?.desc || '';
});

function onRoleChange() {
  const opt = roleOptions.find(o => o.value === formData.role);
  formData.role_id = opt?.id ?? null;
}

// Modal & Form State
const showModal = ref(false);
const isEdit = ref(false);
const isSaving = ref(false);
const formData = reactive({
  id: null as number | null,
  username: '',
  password: '',
  alias: '',
  unit_kerja: '',
  role_id: null as number | null,
  role: ''
});

function openModal(row?: UserRow) {
  isEdit.value = !!row;
  if (row) {
    formData.id = row.id;
    formData.username = row.username !== '-' ? row.username : '';
    formData.password = '';
    
    // Look up original item using the fast Map (avoids stale data / type mismatch issues)
    const originalItem = rawDataById.value.get(Number(row.id)) ?? null;

    if (originalItem) {
      formData.alias = originalItem.alias || '';
      formData.unit_kerja = originalItem.unit_kerja || '';
      // Derive role string: prefer stored string, fallback to mapping from role_id
      const roleStr = originalItem.role?.trim() || roleOptions.find(o => o.id === originalItem.role_id)?.value || '';
      formData.role = roleStr;
      formData.role_id = originalItem.role_id ?? (roleOptions.find(o => o.value === roleStr)?.id ?? null);
    } else {
      // Fallback using row values (should rarely happen)
      formData.alias = row.nama !== '-' ? row.nama : '';
      formData.unit_kerja = row.unit_kerja !== '-' ? row.unit_kerja : '';
      const roleStr = row.role !== '-' ? row.role : '';
      formData.role = roleStr;
      formData.role_id = row.role_id !== '-' ? Number(row.role_id) : (roleOptions.find(o => o.value === roleStr)?.id ?? null);
    }
  } else {
    formData.id = null;
    formData.username = '';
    formData.password = '';
    formData.alias = '';
    formData.unit_kerja = '';
    formData.role_id = null;
    formData.role = '';
  }
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function saveUser() {
  if (isSaving.value) return;
  isSaving.value = true;
  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.statusMessage || 'Gagal menyimpan data');
    }
    
    closeModal();
    await refresh();
  } catch (err: any) {
    alert(err.message || 'Terjadi kesalahan saat menyimpan data');
  } finally {
    isSaving.value = false;
  }
}

async function deleteUser(id: number) {
  if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
  
  try {
    // using PUT/DELETE (we implemented DELETE in /api/users, but could also call users with PUT body={id} if preferred, standard is DELETE)
    const response = await fetch('/api/users', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id })
    });
    
    if (!response.ok) {
      const result = await response.json();
      throw new Error(result.statusMessage || 'Gagal menghapus data');
    }
    
    await refresh();
  } catch (err: any) {
    alert(err.message || 'Terjadi kesalahan saat menghapus data');
  }
}
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
