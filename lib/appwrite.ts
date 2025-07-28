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
        const newAccount = await account.create(ID.unique(), email, password, name);

        if(!newAccount) throw Error;

        const session = await signIn({email, password}); // Capture the session from signIn

        const avatarUrl = avatars.getInitialsURL(name);

<<<<<<< HEAD
        return await databases.createDocument(
            appwriteConfig.databaseId,
=======
        await databases.createDocument(
            appwriteConfig.databseId,
>>>>>>> 3b0f49beebc9a0f7f5c6eba5cf9837b3cd6ad600
            appwriteConfig.userCollectionId,
            ID.unique(),
            {   email,name,
                accountId : newAccount.$id,
                avatar: avatarUrl

            }
        )

        return session; // Return the session

    }
    catch(e){
        throw new Error(e as string)
    }
}

export const signIn =  async ({email,password}: SignInParams) => {
    try{
        const session = await account.createEmailPasswordSession(email, password);
        return session; // Return the session object
    }
    catch(e){
        throw new Error(e as string);
    }
}

export const getCurrentUser = async () => {
    try{
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser)throw Error;

        return currentUser.documents[0];

    }
    catch(e){
        console.log(e);
        throw new Error(e as string);        
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
    catch(e){
        throw new Error(e as string)
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
    catch(e){
        throw new Error(e as string)
    }
}

export const signOut = async () => {
  try {
    const session = await account.deleteSession('current');
    return session;
  } catch (error) {
    throw new Error(error as string);
  }
};