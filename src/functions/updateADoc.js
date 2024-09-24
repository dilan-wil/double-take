import { updateDoc, doc } from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

export const updateADoc = async (uid, updateValues, setTheDoc) => {
  const userDocRef = doc(db, 'users', uid);
    if(updateValues.profilePicture){
        const profileImageRef = ref(storage, `posts/${uid}/${updateValues.profilePicture.name}`);
        const profileImageTask = uploadBytesResumable(profileImageRef, updateValues.profilePicture);
        const profilePictureURL = await getDownloadURL((await profileImageTask).ref);
        updateValues.profilePicture=profilePictureURL
    }
  await updateDoc(userDocRef, updateValues);
  // Update the local userDoc state
  setTheDoc(theDoc => ({
    ...theDoc,
    updateValues
  }));
};
