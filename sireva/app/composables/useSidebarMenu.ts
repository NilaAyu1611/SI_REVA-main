import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthUser } from '@/composables/useAuthUser';
import { SIDEBAR_MENU_ROUTES } from '@/constants/sidebarMenuRoutes';

export interface SidebarMenuChildItem {
  label: string;
  href: string;
  icon: string;
}

export interface SidebarMenuItem {
  label: string;
  href?: string;
  children?: SidebarMenuChildItem[];
  icon: string;
  optional?: boolean;
}

export type SidebarVariant = 'super_admin' | 'admin' | 'user' | 'verifikator' | 'kepala';

interface UseSidebarMenuOptions {
  variant?: SidebarVariant;
  showLaporan?: boolean;
}

const superAdminMenuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    href: SIDEBAR_MENU_ROUTES.dashboard,
    icon: 'IconDashboard',
  },
  {
    label: 'Master Data',
    icon: 'IconSettings',
    children: [
      { label: 'Master User', href: SIDEBAR_MENU_ROUTES.masterUser, icon: 'IconUser' },
      { label: 'Master Unit Kerja', href: SIDEBAR_MENU_ROUTES.masterUnitKerja, icon: 'IconSitemap' },
      { label: 'Master Visi, Misi, Tujuan', href: SIDEBAR_MENU_ROUTES.masterVisiMisiTujuan, icon: 'IconFlag' },
      { label: 'Master Sasaran Strategis', href: SIDEBAR_MENU_ROUTES.masterSasaranStrategis, icon: 'IconTargetArrow' },
      { label: 'Master Sasaran Program', href: SIDEBAR_MENU_ROUTES.masterSasaranProgram, icon: 'IconFocus2' },
      { label: 'Master Sasaran Kegiatan', href: SIDEBAR_MENU_ROUTES.masterSasaranKegiatan, icon: 'IconListDetails' },
    ],
  },
  {
    label: 'Perencanaan',
    icon: 'IconClipboardList',
    children: [
      { label: 'Sasaran Strategis', href: SIDEBAR_MENU_ROUTES.sasaranStrategis, icon: 'IconTargetArrow' },
    ],
  },
  {
    label: 'Cascading Kinerja',
    href: SIDEBAR_MENU_ROUTES.cascading,
    icon: 'IconSitemap',
  },
  {
    label: 'Laporan',
    icon: 'IconReport',
    children: [
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.laporanSasaranProgram, icon: 'IconReport' },
      { label: 'Sasaran Strategis', href: SIDEBAR_MENU_ROUTES.laporanSasaranStrategis, icon: 'IconReport' },
      { label: 'Perjanjian Kinerja', href: SIDEBAR_MENU_ROUTES.laporanPerjanjianKinerja, icon: 'IconReport' },
      { label: 'Rencana Aksi', href: SIDEBAR_MENU_ROUTES.laporanRencanaAksi, icon: 'IconReport' },
    ],
  },
];

const adminMenuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    href: SIDEBAR_MENU_ROUTES.dashboard,
    icon: 'IconDashboard',
  },
  {
    label: 'Perencanaan',
    icon: 'IconClipboardList',
    children: [
      { label: 'Visi, Misi, Tujuan', href: SIDEBAR_MENU_ROUTES.visiMisiTujuan, icon: 'IconFlag' },
      { label: 'Sasaran Strategis', href: SIDEBAR_MENU_ROUTES.sasaranStrategis, icon: 'IconTargetArrow' },
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.sasaranProgram, icon: 'IconFocus2' },
      { label: 'Sasaran Kegiatan', href: SIDEBAR_MENU_ROUTES.sasaranKegiatan, icon: 'IconListDetails' },
    ],
  },
  {
    label: 'Pemantauan',
    icon: 'IconChartBar',
    children: [
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.pemantauanSasaranProgram, icon: 'IconFocus2' },
      { label: 'Rencana Aksi', href: SIDEBAR_MENU_ROUTES.pemantauanRencanaAksi, icon: 'IconClipboardList' },
    ],
  },
  {
    label: 'Cascading Kinerja',
    href: SIDEBAR_MENU_ROUTES.cascading,
    icon: 'IconSitemap',
  },
  {
    label: 'Laporan',
    icon: 'IconReport',
    children: [
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.laporanSasaranProgram, icon: 'IconReport' },
      { label: 'Perjanjian Kinerja', href: SIDEBAR_MENU_ROUTES.laporanPerjanjianKinerja, icon: 'IconReport' },
    ],
  },
];

const userMenuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    href: SIDEBAR_MENU_ROUTES.dashboard,
    icon: 'IconDashboard',
  },
  {
    label: 'Perencanaan',
    icon: 'IconClipboardList',
    children: [
      { label: 'Visi, Misi, Tujuan', href: SIDEBAR_MENU_ROUTES.visiMisiTujuan, icon: 'IconFlag' },
      { label: 'Sasaran Strategis', href: SIDEBAR_MENU_ROUTES.sasaranStrategis, icon: 'IconTargetArrow' },
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.sasaranProgram, icon: 'IconFocus2' },
      { label: 'Sasaran Kegiatan', href: SIDEBAR_MENU_ROUTES.sasaranKegiatan, icon: 'IconListDetails' },
    ],
  },
  {
    label: 'Pemantauan',
    icon: 'IconChartBar',
    children: [
      { label: 'Sasaran Kegiatan', href: SIDEBAR_MENU_ROUTES.pemantauanSasaranKegiatan, icon: 'IconListDetails' },
      { label: 'Rencana Aksi', href: SIDEBAR_MENU_ROUTES.pemantauanRencanaAksi, icon: 'IconClipboardList' },
    ],
  },
  {
    label: 'Cascading Kinerja',
    href: SIDEBAR_MENU_ROUTES.cascading,
    icon: 'IconSitemap',
  },
  {
    label: 'Laporan',
    icon: 'IconReport',
    children: [
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.laporanSasaranProgram, icon: 'IconReport' },
      { label: 'Sasaran Strategis', href: SIDEBAR_MENU_ROUTES.laporanSasaranStrategis, icon: 'IconReport' },
      { label: 'Perjanjian Kinerja', href: SIDEBAR_MENU_ROUTES.laporanPerjanjianKinerja, icon: 'IconReport' },
      { label: 'Rencana Aksi', href: SIDEBAR_MENU_ROUTES.laporanRencanaAksi, icon: 'IconReport' },
    ],
  },
];

const verifikatorMenuItems: SidebarMenuItem[] = [
  ...userMenuItems,
];

const kepalaMenuItems: SidebarMenuItem[] = [
  ...userMenuItems,
];

export function useSidebarMenu(options: UseSidebarMenuOptions = {}) {
  const route = useRoute();
  const { role, authUser } = useAuthUser();

  const showLaporan = options.showLaporan ?? true;
  const slug = computed(() => String(route.params.slug || '').toLowerCase());

  const resolvedVariant = computed<SidebarVariant>(() => {
    if (options.variant) return options.variant;
    
    // Resolve by role string first (more reliable in this DB setup)
    const roleStr = authUser.value?.role?.trim().toLowerCase();
    if (roleStr === 'super_admin') return 'super_admin';
    if (roleStr === 'admin') return 'admin';
    if (roleStr === 'user') return 'user';
    if (roleStr === 'verifikator') return 'verifikator';
    if (roleStr === 'kepala') return 'kepala';

    // Fallback to role_id
    const roleId = authUser.value?.role_id;
    if (roleId === 1) return 'super_admin';
    if (roleId === 2) return 'admin';
    if (roleId === 3) return 'user';
    
    return (slug.value?.replace(/\s+/g, '_') as SidebarVariant) || 'user';
  });

  const menuTitle = computed(() => {
    switch (resolvedVariant.value) {
      case 'super_admin': return 'Menu Super Admin';
      case 'admin': return 'Menu Admin (Eselon 1)';
      case 'user': return 'Menu User';
      case 'verifikator': return 'Menu Verifikator';
      case 'kepala': return 'Menu Kepala';
      default: return 'Menu Utama';
    }
  });

  const slugPrefix = computed(() => (slug.value ? `/${slug.value}` : ''));

  const resolveHref = (href: string) => `${slugPrefix.value}${href}`;

  const menuItems = computed<SidebarMenuItem[]>(() => {
    let baseMenuItems: SidebarMenuItem[] = [];
    switch (resolvedVariant.value) {
      case 'super_admin': baseMenuItems = superAdminMenuItems; break;
      case 'admin': baseMenuItems = adminMenuItems; break;
      case 'verifikator': baseMenuItems = verifikatorMenuItems; break;
      case 'kepala': baseMenuItems = kepalaMenuItems; break;
      default: baseMenuItems = userMenuItems; break;
    }
    
    return baseMenuItems
      .filter((item) => !(item.optional && !showLaporan))
      .map((item) => ({
        ...item,
        href: item.href ? resolveHref(item.href) : undefined,
        children: item.children?.map((child) => ({
          ...child,
          href: resolveHref(child.href),
        })),
      }));
  });

  return { menuItems, menuTitle, resolvedVariant };
}
