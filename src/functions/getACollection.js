import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore'

export const getACollection = async (collect) => {
    try {
        // Reference to the "posts" collection
        const postsCollectionRef = collection(db, collect);
        
        // Get all documents from the "posts" collection
        const querySnapshot = await getDocs(postsCollectionRef);
    
        // Map through the documents and get their data
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
        return posts; // Return the array of posts
    } catch (error) {
        console.error("Error getting posts:", error);
        return []; // Return an empty array in case of error
    }
}