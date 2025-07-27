import { Client } from "react-native-appwrite";

export const appwriteConfig = {
 endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
 platform: "com.saiesh_techscribe.fooddelivery",
 projectId : process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
 databseId: "68854758001196aeeea7",
 userCollectionId: "6885477b0009a24283a1"
}

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)