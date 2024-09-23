import { db } from "./firebase"
import { addDoc, setDoc, collection, serverTimestamp } from "firebase/firestore"

export const addLive = async (userId, postId) => {
    try {
        const collectionRef = collection(db, "lives")
        await addDoc(collectionRef, {
            userId: userId,
            postId: postId,
            createdAt: serverTimestamp()
        })
        await setDoc(doc(collection(db, "users", userId, "live")), {
            postId: postId,
          })
    } catch(error) {
        console.log(error)
    }

}