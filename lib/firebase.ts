// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { Firestore, addDoc, collection,limit as firestoreLimit, 
    setDoc,
    getDoc,
    getFirestore,
    Timestamp,
    query,
    orderBy,
    getDocs,
    updateDoc,
    where,
    startAfter,
    doc,
    deleteDoc,
  } from "firebase/firestore"
  import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes, } from "firebase/storage"
import { promise } from "zod";
import { FilterProps, Products, SetProducts } from "@/types/firebasetypes";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrFzbq7UI_IZr9wS1oobjGRvqe4WXw31U",
  authDomain: "skye-30aeb.firebaseapp.com",
  projectId: "skye-30aeb",
  storageBucket: "skye-30aeb.appspot.com",
  messagingSenderId: "880574176963",
  appId: "1:880574176963:web:fbea90c8b3581098ae4c76",
  measurementId: "G-7LSBKE5JPK"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const db = getFirestore(app)
export const storage = getStorage(app)





  export const addDetails = async({
    name,
    facePicture,
    ...patient
  }:PatientDetailsParams) => {
    try {
      const patientRef = collection(db, 'patients')
  
      const docRef = await addDoc(patientRef, {
        ...patient,
        name, // Ensure name is included in the Firestore document
      })
  if(facePicture && facePicture.length > 0){
     const folderPath = `patients/${name}`
    for(let i=0; i < facePicture.length; i++ ){
      const file = facePicture[i];
      const storageRef = ref(storage, `${folderPath}/${name}${i + 1}`);
      await uploadBytes(storageRef, file);
    }
  }
      console.log('Property and images added successfully');
    } catch (error) {
      console.log(error)
    }
  }


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
  

export const updateProducts = async (productId: string, updatedData: Partial<Products>): Promise<void> => {
  try {
    const cleanedData = Object.fromEntries(Object.entries(updatedData).filter(([_, v]) => v !== undefined && v !== ""));
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, cleanedData);
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


