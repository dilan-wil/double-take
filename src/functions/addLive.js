import { db } from "./firebase"
import { doc, addDoc, setDoc, collection, serverTimestamp } from "firebase/firestore"

export const addLive = async (userId, postId) => {
    try {
        const collectionRef = collection(db, "lives")
        const liveRef = await addDoc(collectionRef, {
            userId: userId,
            postId: postId,
            createdAt: serverTimestamp()
        })
        await setDoc(doc(collection(db, "users", userId, "lives")), {
            liveId: liveRef.id,
            postId: postId
        })
    } catch(error) {
        console.log(error)
    }

}