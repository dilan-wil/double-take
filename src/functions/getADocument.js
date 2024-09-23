import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase"; 

export const getADocument = async (id, collection) => {
    try {
      // Reference to the document
      const docRef = doc(db, collection, id);
  
      // Get the document
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        // Document data
        return {id: id, ...docSnap.data()}; // Return the document data
      } else {
        // Document does not exist
        return null; // Return null or handle the absence of the document
      }
    } catch (error) {
      console.error("Error getting document:", error);
      // Handle error (e.g., show an error message)
      return null;
    }
};