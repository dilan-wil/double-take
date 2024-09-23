import { db } from "./firebase"
import { doc, setDoc, collection, serverTimestamp } from "firebase/firestore"

export const addComment = async (userId, postId, comment) => {
    try {
        const collectionRef = collection(db, "posts", postId, "comments")
        await setDoc(doc(collectionRef), {
            userId: userId,
            content: comment,
            createdAt: serverTimestamp(),
            likes: 0
        })
    } catch(error) {
        console.log(error)
    }

}