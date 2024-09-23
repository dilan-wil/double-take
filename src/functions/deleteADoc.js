import { deleteDoc, doc } from 'firebase/firestore';
import { db, storage } from './firebase';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

export const deleteADoc = async (docId, docCollection) => {
  try{
    const userDocRef = doc(db, docCollection, docId);
    await deleteDoc(userDocRef);
  } catch(error){
    console.log(error)
  } 
};
