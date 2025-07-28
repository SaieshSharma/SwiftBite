import { getCurrentUser } from '@/lib/appwrite';
import { User } from '@sentry/react-native'
import { create } from 'zustand'

type AuthState = {
    isAuthenticated: boolean
    user: User | null;
    isLoading: boolean

    setIsAuthenticated: (value: boolean) => void
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    setIsLoggedIn: (value: boolean) => void // Add this method

    fetchAuthenticatedUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: false,
    user: null, // Fix: was "User | null" instead of null
    isLoading: true,

    setIsAuthenticated: (value) => set({isAuthenticated: value}),
    setUser: (user) => set({user}),
    setLoading: (value) => set({isLoading: value}),
    setIsLoggedIn: (value) => set({isAuthenticated: value}), // Add this implementation

    fetchAuthenticatedUser: async() => {
        set({isLoading: true});

        try{
            const user = await getCurrentUser();

            if(user) {
                set({isAuthenticated: true, user: user as User});
            } else {
                set({isAuthenticated: false, user: null});
            }
        }
        catch(e){
            console.log('fetchAuthenticatedUser error', e);
            set({isAuthenticated: false, user: null});
        }
        finally{
            set({isLoading: false})
        }
    }

}))

export default useAuthStore;