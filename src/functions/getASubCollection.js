import { db } from './firebase'
import { collection, getDocs } from 'firebase/firestore'

export const getASubCollection = async (collect, id, subCollect) => {
    try {
        // Reference to the "posts" collection
        const postsCollectionRef = collection(db, collect, id, subCollect);
        
        // Get all documents from the "posts" collection
        const querySnapshot = await getDocs(postsCollectionRef);
        if(!querySnapshot.empty){
            // Map through the documents and get their data
            const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
            return posts; // Return the array of posts
        } else {
            return []
        }
    } catch (error) {
        console.error("Error getting posts:", error);
        return []; // Return an empty array in case of error
    }
}