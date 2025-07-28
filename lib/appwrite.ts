import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
 endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
 platform: "com.saiesh_techscribe.fooddelivery",
 projectId : process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
 databseId: "68854758001196aeeea7",
 userCollectionId: "6885477b0009a24283a1"
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)

export const account = new Account(client);
export const databases = new Databases(client);
const avatars = new Avatars(client);

export const createUser = async ({email, password, name} : CreateUserParams) => {
    try{
        const newAccount = await account.create(ID.unique(), email, password, name);

        if(!newAccount) throw Error;

        const session = await signIn({email, password}); // Capture the session from signIn

        const avatarUrl = avatars.getInitialsURL(name);

        await databases.createDocument(
            appwriteConfig.databseId,
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
            appwriteConfig.databseId,
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