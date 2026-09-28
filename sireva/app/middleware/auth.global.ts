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

  // Helper to normalize and get user's role slug
  const getRoleSlug = (user: any) => {
    if (!user) return 'user'
    
    // Check role string first (more reliable in this DB setup)
    if (user.role) {
      const roleStr = String(user.role)
        .trim()
        .toLowerCase()
        .replace(/[-\s]+/g, '_')
      if (roleStr === 'super_admin') return 'super_admin'
      if (roleStr === 'admin') return 'admin'
      if (roleStr === 'user') return 'user'
      if (roleStr === 'verifikator') return 'verifikator'
      if (roleStr === 'kepala') return 'kepala'
    }
    
    // Fallback to role_id
    const roleId = Number(user.role_id)
    if (roleId === 1) return 'super_admin'
    if (roleId === 2) return 'admin'
    if (roleId === 3) return 'user'
    
    return 'user'
  }

  const userRole = getRoleSlug(authUser.value)

  // 4. Role-based path protection (Slug validation and specific path RBAC)
  // Our URLs are structured as /[role]/[page]
  const pathParts = to.path.split('/').filter(Boolean)
  if (pathParts.length > 0 && pathParts[0]) {
    const slug = pathParts[0].toLowerCase()
    
    // List of known system roles to check
    const roles = ['super_admin', 'admin', 'user', 'verifikator', 'kepala']
    
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
          '/cascading',
          '/laporan'
        ]
      } else if (userRole === 'admin') {
        allowedPaths = [
          '/dashboard',
          '/visi-misi-tujuan',
          '/sasaran-strategis',
          '/sasaran-program',
          '/sasaran-kegiatan',
          '/pemantauan-kinerja/sasaran-program',
          '/pemantauan-kinerja/rencana-aksi',
          '/cascading',
          '/laporan/sasaran-program',
          '/laporan/perjanjian-kinerja'
        ]
      } else {
        // 'user', 'verifikator', 'kepala', etc.
        allowedPaths = [
          '/dashboard',
          '/visi-misi-tujuan',
          '/sasaran-strategis',
          '/sasaran-program',
          '/sasaran-kegiatan',
          '/pemantauan-kinerja/sasaran-kegiatan',
          '/pemantauan-kinerja/rencana-aksi',
          '/cascading',
          '/laporan'
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
