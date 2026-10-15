import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  google_id?: string;
  is_verified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  rehydrate: () => void; // Add rehydrate function
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true, // Start with loading true
      
      login: (user, token) => {
        console.log('🔐 Login called with:', { user, token });
        
        // Normalize user data
        const normalizedUser = {
          id: user.id,
          email: user.email || '',
          name: user.name || user.given_name || '',
          given_name: user.given_name || '',
          family_name: user.family_name || '',
          picture: user.picture || '',
          google_id: user.google_id || '',
          is_verified: user.is_verified || true
        };
        
        // Save to localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        
        set({ 
          user: normalizedUser, 
          token, 
          isAuthenticated: true,
          isLoading: false
        });
        
        console.log('🔐 State updated, user:', normalizedUser);
      },
      
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false
        });
      },

      rehydrate: () => {
        // Check localStorage directly
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        console.log('💧 Rehydrating - token:', storedToken, 'user:', storedUser);
        
        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            set({
              user: parsedUser,
              token: storedToken,
              isAuthenticated: true,
              isLoading: false
            });
            console.log('💧 Rehydrated successfully:', parsedUser);
          } catch (e) {
            console.error('💧 Rehydrate failed:', e);
            set({ isLoading: false });
          }
        } else {
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

// Call rehydrate immediately
useAuthStore.getState().rehydrate();

export default useAuthStore;
