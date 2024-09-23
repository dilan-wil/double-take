import { auth, db} from "./firebase"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { doc, setDoc, serverTimestamp } from "firebase/firestore"

export const signIn = async ( name, email, password, username, navigate) => {
    try {
        // Sign up the user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        sendEmailVerification(user)
        // Create a document for the user in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          fullName: name,
          username: username, // Additional data
          createdAt: serverTimestamp(),
        });
  
        navigate("/")
      } catch (error) {
        throw error;
    }
}