import { FilterProps, Products, SetProducts } from "@/types/firebasetypes";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, startAfter, 
    updateDoc, where, limit as firestoreLimit, } from "firebase/firestore";
import { db, storage } from "../firebase";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";

export const addProducts = async(product: Products, imageFiles: File[]): Promise<void> => {
    console.log("addingProducts")
    try {
      const productRef = collection(db, 'products');
      const { imageFiles: removedImageFiles, ...productData } = product;
  
      // Add product to Firestore
      const docRef = await addDoc(productRef, productData);
      const imageUrls: string[] = [];
      
      console.log(imageUrls, product.imageFiles, 'check')
      // Check if image files exist
      if (product.imageFiles && product.imageFiles.length > 0) {
        console.log('Images found:', product.imageFiles.length);
  
        for (let i = 0; i < product.imageFiles.length; i++) {
          const file = product.imageFiles[i];
          console.log('Uploading image:', file.name);
  
          // Constructing the storage reference
          const storageRef = ref(storage, `products/${productData.name}-${docRef.id}/${productData.name}_${i + 1}`);
          console.log(storageRef, product.name, 'products', product.name, 'imagePath')
  
          try {
            // Attempt to upload the file
            await uploadBytes(storageRef, file);
            console.log('Image uploaded successfully:', file.name);
  
            // Get the download URL
            const downloadUrl = await getDownloadURL(storageRef);
            imageUrls.push(downloadUrl);
            console.log('Download URL:', downloadUrl);
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
          }
        }
  
        // Once all images are uploaded, update Firestore with the image URLs
        await updateDoc(docRef, { images: imageUrls});
      } else {
        console.log('No images to upload.');
      }
  
      console.log('Product and images added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };
  


  export const getProducts = async (filters: FilterProps, lastVisible: any = null): Promise<{ product: Products[],  lastVisible: any }> => {
    try {
      const { skinType, skinConcern, category, limit: fetchLimit } = filters;
      const productCollectionRef = collection(db, "products");
      
      // Start with the basic query and apply filters conditionally
      let productQuery = query(productCollectionRef, orderBy("id", "desc"));
  
      // Apply the category filter if provided
      if (category) {
        productQuery = query(productQuery, where("category", "==", category));
        console.log('Category filter applied:', category);
      }
  
      // Apply the skinType filter if provided
      if (skinType) {
        productQuery = query(productQuery, where("skinType", "==", skinType));
        console.log('Skin Type filter applied:', skinType);
      }
  
      // Apply the skinConcern filter if provided
      if (skinConcern) {
        productQuery = query(productQuery, where("skinConcern", "==", skinConcern));
        console.log('Skin Concern filter applied:', skinConcern);
      }
  
      // For pagination, apply the lastVisible filter if provided
      if (lastVisible) {
        productQuery = query(productQuery, startAfter(lastVisible));
      }
  
      // Apply the limit to restrict the number of documents retrieved
      if (fetchLimit) {
        productQuery = query(productQuery, firestoreLimit(fetchLimit));
      }
  
      const querySnapshot = await getDocs(productQuery);
      console.log(`Number of products found: ${querySnapshot.docs.length}`);
  
      const newLastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const productData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Products[];
  
      return { product: productData, lastVisible: newLastVisible };
      
    } catch (error) {
      console.error("Error fetching products:", error);
      return { product: [], lastVisible: null };
    }
  };
  

  export const updateProducts = async (productId: string, productToUpdate: { product: { number: number } }): Promise<void> => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, { number: productToUpdate.product.number });
      console.log('Product updated successfully', productId);
    } catch (error) {
      console.error('Error updating product: ', error);
      throw error;
    }
  };
  




export const deleteProduct = async(productId: string, ImagePath:string, setProducts:SetProducts): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'products', productId))

    //Delete associated property image from Firebase storage
    const imageListRef = ref(storage, `${ImagePath}/`);
    const imageList = await listAll(imageListRef);
    const deletePromises = imageList.items.map((item) => deleteObject(ref(storage, item.fullPath)));

    await Promise.all(deletePromises);

    setProducts((prevProd) => prevProd.filter((prod) => prod.id !== productId ));
    console.log(`Car with id ${productId} deleted successfully`)
  } catch (error) {
    console.error(`Error deleting car with id ${productId}:`, error)
  }
}


