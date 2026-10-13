export type RoleSlug = 'super_admin' | 'pimpinan' | 'unit_kerja' | 'user_admin' | 'verifikator'


const ROLE_SLUG_BY_ID: Record<number, RoleSlug> = {
  1: 'super_admin',
  2: 'pimpinan',
  3: 'unit_kerja',
  4: 'user_admin',
  5: 'verifikator',
}

const LEGACY_ROLE_SLUG: Record<string, RoleSlug> = {
  user: 'unit_kerja',
  admin: 'user_admin',
  kepala: 'pimpinan',
  user_verifikator: 'verifikator',
}

export function resolveRoleSlug(user: { role?: string | null; role_id?: number | string | null } | null | undefined): RoleSlug {
  const byId = ROLE_SLUG_BY_ID[Number(user?.role_id)]
  if (byId) return byId

  const text = String(user?.role || '').trim().toLowerCase().replace(/[-\s]+/g, '_')
  if (text in LEGACY_ROLE_SLUG) return LEGACY_ROLE_SLUG[text] as RoleSlug
  if (Object.values(ROLE_SLUG_BY_ID).includes(text as RoleSlug)) return text as RoleSlug
  return 'unit_kerja'
}

export const ROLE_SLUGS = Object.values(ROLE_SLUG_BY_ID)
