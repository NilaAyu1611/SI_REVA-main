import { useAuthUser } from '~/composables/useAuthUser'

export default defineNuxtRouteMiddleware((to, from) => {
  // 1. Skip middleware during SSR if needed, or if on login page
  const publicRoutes = ['/login', '/', '/visi-misi', '/produk-hukum']
  if (publicRoutes.includes(to.path)) {
    return
  }

  // 2. Get auth state
  const { authUser } = useAuthUser()
  
  // 3. If no user, redirect to login
  if (!authUser.value) {
    return navigateTo('/login')
  }

  const userRole = resolveRoleSlug(authUser.value)

  // 4. Role-based path protection (Slug validation and specific path RBAC)
  // Our URLs are structured as /[role]/[page]
  const pathParts = to.path.split('/').filter(Boolean)
  if (pathParts.length > 0 && pathParts[0]) {
    const slug = pathParts[0].toLowerCase()
    
    // List of known system roles to check
    const roles: string[] = ROLE_SLUGS
    
    if (roles.includes(slug)) {
      // User must only access routes matching their own normalized role slug
      if (slug !== userRole) {
        return navigateTo(`/${userRole}/dashboard`)
      }
      
      // Get the relative path after the role slug
      // e.g. /super_admin/master-user -> /master-user
      const relativePath = '/' + pathParts.slice(1).join('/')
      
      // Allow the slug root index route (Peta Kinerja)
      if (relativePath === '/' || relativePath === '') {
        return
      }
      
      // Define specific allowed paths for each role
      let allowedPaths: string[] = []
      if (userRole === 'super_admin') {
        allowedPaths = [
          '/dashboard',
          '/master-user',
          '/master-unit-kerja',
          '/master-visi-misi-tujuan',
          '/master-sasaran-strategis',
          '/master-sasaran-program',
          '/master-sasaran-kegiatan',
          '/sasaran-strategis',
          '/rencana-aksi',
          '/perjanjian-kinerja',
          '/pemantauan-kinerja/sasaran-program',
          '/pemantauan-kinerja/sasaran-kegiatan',
          '/pemantauan-kinerja/rencana-aksi',
          '/cascading',
          '/laporan/kinerja-triwulan',
          '/laporan/rencana-aksi',
          '/laporan/perjanjian-kinerja'
        ]
      } else if (userRole === 'user_admin') {
        allowedPaths = ['/dashboard', '/master-user']
      } else if (userRole === 'pimpinan') {
        allowedPaths = [
          '/dashboard',
          '/visi-misi-tujuan',
          '/sasaran-strategis',
          '/sasaran-program',
          '/sasaran-kegiatan',
          '/rencana-aksi',
          '/perjanjian-kinerja',
          '/pemantauan-kinerja/sasaran-program',
          '/pemantauan-kinerja/rencana-aksi',
          '/cascading',
          '/laporan/kinerja-triwulan',
          '/laporan/rencana-aksi',
          '/laporan/perjanjian-kinerja'
        ]
      } else {
        allowedPaths = [
          '/dashboard',
          '/visi-misi-tujuan',
          '/sasaran-strategis',
          '/sasaran-program',
          '/sasaran-kegiatan',
          '/rencana-aksi',
          '/perjanjian-kinerja',
          '/pemantauan-kinerja/sasaran-kegiatan',
          '/pemantauan-kinerja/rencana-aksi',
          '/cascading',
          '/laporan/kinerja-triwulan',
          '/laporan/rencana-aksi',
          '/laporan/perjanjian-kinerja'
        ]
      }
      
      // Validate the route against the allowed paths list using startsWith for sub-pages
      const isAllowed = allowedPaths.some(allowed => {
        return relativePath === allowed || relativePath.startsWith(allowed + '/')
      })
      
      if (!isAllowed) {
        return navigateTo(`/${userRole}/dashboard`)
      }
    }
  }
})
