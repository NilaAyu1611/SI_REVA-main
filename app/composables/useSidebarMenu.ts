import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthUser } from '@/composables/useAuthUser';
import { SIDEBAR_MENU_ROUTES } from '@/constants/sidebarMenuRoutes';
import type { RoleSlug } from '@/utils/roles';

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

export type SidebarVariant = RoleSlug;

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
      { label: 'Master Rencana Aksi', href: SIDEBAR_MENU_ROUTES.rencanaAksi, icon: 'IconClipboardList' },
    ],
  },
  {
    label: 'Perencanaan',
    icon: 'IconClipboardList',
    children: [
      { label: 'Sasaran Strategis', href: SIDEBAR_MENU_ROUTES.sasaranStrategis, icon: 'IconTargetArrow' },
      { label: 'Rencana Aksi', href: SIDEBAR_MENU_ROUTES.rencanaAksi, icon: 'IconClipboardList' },
    ],
  },
  {
    label: 'Pemantauan',
    icon: 'IconChartBar',
    children: [
      { label: 'Sasaran Program', href: SIDEBAR_MENU_ROUTES.pemantauanSasaranProgram, icon: 'IconFocus2' },
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
      { label: 'Kinerja Triwulanan', href: SIDEBAR_MENU_ROUTES.laporanKinerjaTriwulan, icon: 'IconReport' },
    ],
  },
];

const pimpinanMenuItems: SidebarMenuItem[] = [
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
      { label: 'Rencana Aksi', href: SIDEBAR_MENU_ROUTES.rencanaAksi, icon: 'IconClipboardList' },
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
      { label: 'Kinerja Triwulanan', href: SIDEBAR_MENU_ROUTES.laporanKinerjaTriwulan, icon: 'IconReport' },
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
      { label: 'Rencana Aksi', href: SIDEBAR_MENU_ROUTES.rencanaAksi, icon: 'IconClipboardList' },
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
      { label: 'Kinerja Triwulanan', href: SIDEBAR_MENU_ROUTES.laporanKinerjaTriwulan, icon: 'IconReport' },
    ],
  },
];

const verifikatorMenuItems: SidebarMenuItem[] = [
  ...userMenuItems,
];

const userAdminMenuItems: SidebarMenuItem[] = [
  {
    label: 'Dashboard',
    href: SIDEBAR_MENU_ROUTES.dashboard,
    icon: 'IconDashboard',
  },
  {
    label: 'Master User',
    href: SIDEBAR_MENU_ROUTES.masterUser,
    icon: 'IconUser',
  },
];

export function useSidebarMenu(options: UseSidebarMenuOptions = {}) {
  const route = useRoute();
  const { role, authUser } = useAuthUser();

  const showLaporan = options.showLaporan ?? true;
  const slug = computed(() => String(route.params.slug || '').toLowerCase());

  const resolvedVariant = computed<SidebarVariant>(() => {
    if (options.variant) return options.variant;
    return authUser.value ? resolveRoleSlug(authUser.value) : 'unit_kerja';
  });

  const menuTitle = computed(() => {
    switch (resolvedVariant.value) {
      case 'super_admin': return 'Menu Super Admin';
      case 'pimpinan': return 'Menu Pimpinan';
      case 'unit_kerja': return 'Menu Unit Kerja';
      case 'verifikator': return 'Menu Verifikator';
      case 'user_admin': return 'Menu User Admin';
      default: return 'Menu Utama';
    }
  });

  const slugPrefix = computed(() => (slug.value ? `/${slug.value}` : ''));

  const resolveHref = (href: string) => `${slugPrefix.value}${href}`;

  const menuItems = computed<SidebarMenuItem[]>(() => {
    let baseMenuItems: SidebarMenuItem[] = [];
    switch (resolvedVariant.value) {
      case 'super_admin': baseMenuItems = superAdminMenuItems; break;
      case 'pimpinan': baseMenuItems = pimpinanMenuItems; break;
      case 'verifikator': baseMenuItems = verifikatorMenuItems; break;
      case 'user_admin': baseMenuItems = userAdminMenuItems; break;
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
