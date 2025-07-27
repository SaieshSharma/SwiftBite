import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, storage } from "./appwrite";
import dummyData from "./data";

interface Category {
    name: string;
    description: string;
}

interface Customization {
    name: string;
    price: number;
    type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
    name: string;
    description: string;
    image_url: string;
    price: number;
    rating: number;
    calories: number;
    protein: number;
    category_name: string;
    customizations: string[];
}

interface DummyData {
    categories: Category[];
    customizations: Customization[];
    menu: MenuItem[];
}

// ensure dummyData has correct shape
const data = dummyData as DummyData;

// Clear all documents from a collection
async function clearAll(collectionId: string): Promise<void> {
    try {
        const documents = await databases.listDocuments(
            appwriteConfig.databaseId,
            collectionId
        );
        
        for (const doc of documents.documents) {
            await databases.deleteDocument(
                appwriteConfig.databaseId,
                collectionId,
                doc.$id
            );
        }
        console.log(`✅ Cleared all documents from collection: ${collectionId}`);
    } catch (error) {
        console.error(`❌ Error clearing collection ${collectionId}:`, error);
    }
}

// Clear storage bucket (commented out for now)
async function clearStorage(): Promise<void> {
    // Commenting out storage clearing since we're not uploading images
    console.log("⚠️ Storage clearing skipped - using original URLs");
    
    // try {
    //     const files = await storage.listFiles(appwriteConfig.bucketId);
    //     for (const file of files.files) {
    //         await storage.deleteFile(appwriteConfig.bucketId, file.$id);
    //     }
    //     console.log("✅ Storage cleared");
    // } catch (error) {
    //     console.error("❌ Error clearing storage:", error);
    // }
}

// Upload image function (commented out for now)
async function uploadImageToStorage(imageUrl: string) {
    // Commenting out image upload functionality
    // Just return the original URL for now
    console.log("⚠️ Image upload skipped, using original URL:", imageUrl);
    return imageUrl;
    
    // Original upload code (commented out):
    // try {
    //     const response = await fetch(imageUrl);
    //     const blob = await response.blob();
    //     const fileName = imageUrl.split('/').pop() || 'image.png';
    //     
    //     const fileObj = {
    //         name: fileName,
    //         type: blob.type || "image/png",
    //         size: blob.size,
    //         uri: imageUrl,
    //     };
    //     
    //     const file = await storage.createFile(
    //         appwriteConfig.bucketId,
    //         ID.unique(),
    //         fileObj
    //     );
    //     
    //     return storage.getFileView(appwriteConfig.bucketId, file.$id);
    // } catch (error) {
    //     console.error("❌ Error uploading image:", error);
    //     return imageUrl; // fallback to original URL
    // }
}

async function seed(): Promise<void> {
    try {
        console.log("🌱 Starting database seeding...");

        // Clear existing data
        console.log("🧹 Clearing existing data...");
        await clearAll(appwriteConfig.categoriesCollectionId);
        await clearAll(appwriteConfig.menuCollectionId);
        await clearAll(appwriteConfig.customizationsCollectionId);
        await clearAll(appwriteConfig.menuCustomizationsCollectionId);
        await clearStorage();

        // 1. Create categories
        console.log("📁 Creating categories...");
        const categoryMap: { [key: string]: string } = {};
        
        for (const category of data.categories) {
            const doc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.categoriesCollectionId,
                ID.unique(),
                {
                    name: category.name,
                    description: category.description,
                }
            );
            categoryMap[category.name] = doc.$id;
            console.log(`✅ Category created: ${category.name}`);
        }

        // 2. Create customizations
        console.log("🎨 Creating customizations...");
        const customizationMap: { [key: string]: string } = {};
        
        for (const customization of data.customizations) {
            const doc = await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.customizationsCollectionId,
                ID.unique(),
                {
                    name: customization.name,
                    price: customization.price,
                    type: customization.type,
                }
            );
            customizationMap[customization.name] = doc.$id;
            console.log(`✅ Customization created: ${customization.name}`);
        }

        // 3. Create menu items
        console.log("🍕 Creating menu items...");
        const menuMap: { [key: string]: string } = {};
        
        for (const item of data.menu) {
            try {
                console.log(`Processing: ${item.name}`);
                
                // Use original image URL instead of uploading
                const imageUrl = item.image_url; // Direct use of original URL
                
                // Create menu item with basic attributes only
                const menuData = {
                    name: item.name,
                    description: item.description,
                    image_url: imageUrl, // Using original URL
                    price: Number(item.price),
                    rating: Number(item.rating),
                    calories: Number(item.calories),
                    protein: Number(item.protein),
                    category_name: item.category_name, // Store as string for now
                };

                const doc = await databases.createDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.menuCollectionId,
                    ID.unique(),
                    menuData
                );

                menuMap[item.name] = doc.$id;
                console.log(`✅ Menu item created: ${item.name}`);

                // 4. Create menu_customizations relationships
                for (const cusName of item.customizations) {
                    if (customizationMap[cusName]) {
                        await databases.createDocument(
                            appwriteConfig.databaseId,
                            appwriteConfig.menuCustomizationsCollectionId,
                            ID.unique(),
                            {
                                menu: doc.$id,
                                customizations: customizationMap[cusName],
                            }
                        );
                    } else {
                        console.warn(`⚠️ Customization not found: ${cusName}`);
                    }
                }

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.error(`❌ Error creating menu item ${item.name}:`, error);
                // Continue with next item instead of stopping
                continue;
            }
        }

        console.log("✅ Seeding complete.");
        console.log("📊 Summary:");
        console.log(`   Categories: ${Object.keys(categoryMap).length}`);
        console.log(`   Customizations: ${Object.keys(customizationMap).length}`);
        console.log(`   Menu Items: ${Object.keys(menuMap).length}`);
        console.log("⚠️ Note: Using original image URLs (not uploaded to storage)");

    } catch (error) {
        console.error("💥 Seeding failed:", error);
        throw error;
    }
}

export default seed;