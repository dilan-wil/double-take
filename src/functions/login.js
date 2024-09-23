import { auth } from "./firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

export const login = async (email, password, navigate) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    
        // Navigate to the home page
        navigate("/");
      } catch (error) {
        throw error; // Handle this in the calling component
      }
}