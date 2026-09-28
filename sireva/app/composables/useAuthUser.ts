import { computed } from 'vue';

export interface AuthUser {
  id?: number;
  username?: string;
  email?: string;
  role?: string;
  role_id?: number;
  alias?: string;
  unit_kerja?: string;
}

export function useAuthUser() {
  const authUser = useCookie<AuthUser | null>('sireva_user', {
    default: () => null,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  const role = computed(() => String(authUser.value?.role || '').toLowerCase());

  const setAuthUser = (user: AuthUser | null) => {
    authUser.value = user;
  };

  const clearAuthUser = () => {
    authUser.value = null;
    // ensure cookie removed client-side as well
    const cookie = useCookie('sireva_user')
    try {
      cookie.value = null
    } catch (e) {
      console.warn('Failed to clear sireva_user cookie:', e)
    }
  };

  return {
    authUser,
    role,
    setAuthUser,
    clearAuthUser,
  };
}
