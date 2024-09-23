import { collection, addDoc, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { auth, storage, db } from "./firebase";

export const addPost = async (
    user,
    name, 
    description, 
    type, 
    mainContent, 
    end, 
    endType, 
    scenarioCaption, 
    coverImage, 
    scenarios, 
    files,
    navigate
    ) => {

    try {
        // Upload main video
        const coverImageRef = ref(storage, `posts/${user.uid}/${coverImage.name}`);
        const coverUploadTask = uploadBytesResumable(coverImageRef, coverImage);
        const coverImageURL = await getDownloadURL((await coverUploadTask).ref);
        
        let mainDownloadURL = ''
        if (type === 'video' || type === 'audio') {
          const mainFileRef = ref(storage, `posts/${user.uid}/${mainContent.name}`);
          const mainUploadTask = uploadBytesResumable(mainFileRef, mainContent);
          mainDownloadURL = await getDownloadURL((await mainUploadTask).ref);
        }

        let endDownloadURL = ''
        if (endType === 'video' || endType === 'audio') {
          const mainFileRef = ref(storage, `posts/${user.uid}/${end.name}`);
          const mainUploadTask = uploadBytesResumable(mainFileRef, end);
          endDownloadURL = await getDownloadURL((await mainUploadTask).ref);
        }
  
        // Add post document
        const postRef = await addDoc(collection(db, "posts"), {
          name: name,
          description: description,
          coverImage: coverImageURL,
          type: type,
          likes: 0,
          views: 0,
          userId: user.uid,
          mainContent: mainDownloadURL || mainContent,
          scenarioCaption: scenarioCaption || '',
          end: endDownloadURL || end || '',
          endType: endType || '',
          createdAt: serverTimestamp()
        });

        await setDoc(doc(collection(db, "users", user.uid, "posts")), {
          postId: postRef.id,
          coverImage: coverImageURL
        })
  
        // Upload scenarios and add them to the post's subcollection
        await Promise.all(
          scenarios.map(async (scenario) => {
            if (scenario.name && scenario.type) {
              let scenarioDownloadURL = '';
              if (scenario.type === 'video' || scenario.type === 'audio') {
                const scenarioFileRef = ref(storage, `posts/${user.uid}/scenarios/${scenario.main.name}`);
                const scenarioUploadTask = uploadBytesResumable(scenarioFileRef, scenario.main);
                scenarioDownloadURL = await getDownloadURL((await scenarioUploadTask).ref);
              }
              await setDoc(doc(collection(db, "posts", postRef.id, "scenarios")), {
                name: scenario.name,
                type: scenario.type,
                main: scenarioDownloadURL || scenario.main,
                nextCaption: scenario.nextCaption,
                parent: scenario.parent == "" ? "main" : scenario.parent,
                isParent: scenario.isParent
              });
            }
          })
        );
        await Promise.all(
          files.map(async (file) => {
            let fileDownloadURL = '';
            const FileRef = ref(storage, `posts/${user.uid}/scenarios/${file.file.name}`);
            const fileUploadTask = uploadBytesResumable(FileRef, file.file);
            fileDownloadURL = await getDownloadURL((await fileUploadTask).ref);
  
            await setDoc(doc(collection(db, "posts", postRef.id, "files")), {
                name: file.name || file.file.name,
                main: fileDownloadURL,
            });
          })
        );
  
        navigate("/")
      } catch (error) {
        console.error("Error adding post:", error);
      }
}