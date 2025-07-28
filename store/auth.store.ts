import { getCurrentUser, signOut as appwriteSignOut } from '@/lib/appwrite';
import { create } from 'zustand'

type User = {
    $id: string;
    email: string;
    name: string;
    accountId: string;
    avatar: string;
}

type AuthState = {
    isAuthenticated: boolean
    user: User | null;
    isLoading: boolean

    setIsAuthenticated: (value: boolean) => void
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void

    fetchAuthenticatedUser: () => Promise<void>;
    signOut: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null,
    isLoading: false, // Changed from true to false initially

    setIsAuthenticated: (value) => set({isAuthenticated: value}),
    setUser: (user) => set({user}),
    setLoading: (value) => set({isLoading: value}),

    fetchAuthenticatedUser: async() => {
        set({isLoading: true});

        try{
            const userData = await getCurrentUser();

            if(userData) {
                const user: User = {
                    $id: (userData as any).$id,
                    email: (userData as any).email,
                    name: (userData as any).name,
                    accountId: (userData as any).accountId,
                    avatar: (userData as any).avatar,
                };
                set({isAuthenticated: true, user});
            } else {
                set({isAuthenticated: false, user: null});
            }
        }
        catch(e: any){
            console.log('fetchAuthenticatedUser error', e);
            set({isAuthenticated: false, user: null});
        }
        finally{
            set({isLoading: false})
        }
    },

    signOut: async() => {
        try {
            await appwriteSignOut();
            set({isAuthenticated: false, user: null});
        } catch (error) {
            console.log('Sign out error:', error);
            set({isAuthenticated: false, user: null});
        }
    }

}))

export default useAuthStore;