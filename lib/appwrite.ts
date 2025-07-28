import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query , Storage} from "react-native-appwrite";

export const appwriteConfig = {
 endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
 platform: "com.saiesh_techscribe.fooddelivery",
 projectId : process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
 databaseId: "68854758001196aeeea7",
 bucketId: "68862386003010c048f6",
 userCollectionId: "6885477b0009a24283a1",
 categoriesCollectionId: "68861b77003614e7c335",
 menuCollectionId: "68861bef0038c55aa7b6",
 customizationsCollectionId: "6886220f002698698db7",
 menuCustomizationsCollectionId: "688622b30037fe381ad9"
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({email, password, name} : CreateUserParams) => {
    try{
        // Clear any existing sessions first before creating a new user
        try {
            await account.deleteSessions();
        } catch (clearError) {
            // Ignore errors when clearing sessions
        }

        const newAccount = await account.create(ID.unique(), email, password, name);

        if(!newAccount) throw Error;

        // Wait a moment for account creation to fully complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Since we cleared sessions above, signIn should work without issues
        const session = await signIn({email, password}); 

        const avatarUrl = avatars.getInitialsURL(name);

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {   email,name,
                accountId : newAccount.$id,
                avatar: avatarUrl
            }
        )

        return session;

    }
    catch(e: any){
        // If account creation fails due to existing user, try to sign in instead
        if (e?.message && e.message.includes('user with the same id, email, or phone already exists')) {
            try {
                // Clear sessions before attempting sign in
                await account.deleteSessions();
                return await signIn({email, password});
            } catch (signInError: any) {
                throw new Error('Account exists but sign in failed: ' + (signInError?.message || 'Unknown error'));
            }
        }
        throw new Error(e?.message || 'Unknown error occurred');
    }
}

export const signIn = async ({email, password}: SignInParams) => {
    try {
        // First, try to get current session
        try {
            const currentSession = await account.getSession('current');
            if (currentSession) {
                // Verify the session is valid by trying to get user
                try {
                    await account.get();
                    return currentSession; // Valid session exists
                } catch (verifyError) {
                    // Session exists but invalid, delete it
                    await account.deleteSessions();
                }
            }
        } catch (sessionError) {
            // No active session, continue
        }

        // Create new session
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (e: any) {
        // Handle session creation errors
        if (e?.message && (e.message.includes('session') || e.message.includes('prohibited'))) {
            try {
                // Force delete all sessions and try again
                await account.deleteSessions();
                // Wait a moment for session cleanup
                await new Promise(resolve => setTimeout(resolve, 500));
                const session = await account.createEmailPasswordSession(email, password);
                return session;
            } catch (retryError: any) {
                throw new Error('Failed to create session after clearing: ' + (retryError?.message || 'Unknown error'));
            }
        }
        throw new Error(e?.message || 'Unknown error occurred');
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw new Error("No current account");

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        );

        if (!currentUser || currentUser.documents.length === 0) {
            throw new Error("User document not found");
        }

        return currentUser.documents[0];

    } catch (e: any) {
        console.log('getCurrentUser error:', e);
        // If it's a session error, clear the session
        if (e?.message && (e.message.includes('session') || e.message.includes('unauthorized'))) {
            try {
                await account.deleteSessions();
            } catch (deleteError) {
                // Ignore delete errors
            }
        }
        throw new Error(e?.message || 'Unknown error occurred');        
    }
}

export const getMenu = async ({category, query, limit = 10}: GetMenuParams & {limit?: number}) => {
    try{
        const queries: string[] = [];
        
        // Filter by category name instead of ID
        if(category && category !== 'all') {
            queries.push(Query.equal('category_name', category));
        }
        
        if(query) {
            queries.push(Query.search('name', query));
        }
        
        if(limit) {
            queries.push(Query.limit(limit));
        }

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries
        )

        return menus.documents

    }
    catch(e: any){
        throw new Error(e?.message || 'Failed to fetch menu');
    }
}

export const getCategories = async () => {
    try{
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId
        )
        return categories.documents;
    }
    catch(e: any){
        throw new Error(e?.message || 'Failed to fetch categories');
    }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error: any) {
    throw new Error(error?.message || 'Failed to sign out');
  }
};