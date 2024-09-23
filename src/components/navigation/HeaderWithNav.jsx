import React, { useState } from 'react'
import "./Nav.css" 
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, storage, db } from "../../functions/firebase";
import HomeIcon from '@mui/icons-material/Home';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

export const Nav = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [ name, setName ] = useState('')
  const [ main, setMain ] = useState(null)
  const [mainType, setMainType] = useState('');
  const [ description, setDescription ] = useState('')
  const [ scenarioCaption, setScenarioCaption ] = useState('')
  const [ scenarios, setScenarios ] = useState([{ name: "", main: null, type: "" }])
  const [ caption, setCaption ] = useState('');
  const [ user ] = useAuthState(auth);

  const toggleOverlay = () => {
    setOpen(!open);
  };

  const handleScenarioChange = (index, field, value) => {
    const newScenarios = [...scenarios];
    newScenarios[index][field] = value;
    setScenarios(newScenarios);
  };

  const handleAddScenario = () => {
    setScenarios([...scenarios, { name: "", main: null, type: "" }]);
  };

  const handleRemoveScenario = (index) => {
    setScenarios(scenarios.filter((_, i) => i !== index));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setImageUrl(imageUrl);
    }
  };
  const handleUpload = async (e) => {
    console.log("name : ", name)
    console.log("main : ", main)
    console.log(scenarios)
    // if (!type || !name || !main || !user) return "yooo";
    console.log("test")
    try {
      // Upload main video
      let mainDownloadURL = ''
      if (mainType === 'video' || mainType === 'audio') {
        const mainFileRef = ref(storage, `posts/${user.uid}/${main.name}`);
        const mainUploadTask = uploadBytesResumable(mainFileRef, main);
        mainDownloadURL = await getDownloadURL((await mainUploadTask).ref);
      }

      // Add post document
      const postRef = await addDoc(collection(db, "posts"), {
        type: mainType,
        name: name,
        uid: user.uid,
        likes: 0,
        main: mainDownloadURL || main,
        description: description,
        scenarioCaption: scenarioCaption
      });

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
              main: scenarioDownloadURL || main,
            });
          }
        })
      );

      console.log("Post and scenarios added successfully!");
      // Reset the form
      setName("");
      setMain(null);
      setMainType('');
      setDescription('');
      setScenarioCaption('');
      setScenarios([{ name: "", file: null, type: "" }]);
      toggleOverlay();
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  

  return (
    <div className='all'>
    <div className='nav'>
      {/* <a href="/"><img className='nav_logo' src='' alt='instagram' /></a> */}
      <div className='nav_buttons'>
        <button onClick={() => navigate('/')} className='side_button'>
          <HomeIcon />
          <span>Home</span>
        </button>
        
        {/* <button onClick={toggleSearch} className='side_button'>
          <SearchIcon />
          <span>Search</span>
        </button> */}

        {/* <button className='side_button'>
          <ExploreIcon />
          <span>Discover</span>
        </button> */}

        {/* <button className='side_button'>
          <SlideshowIcon />
          <span>Reels</span>
        </button> */}

        {/* <button className='side_button'>
          <SendIcon />
          <span>Messages</span>
        </button> */}
        <button className='side_button'>
          <FavoriteBorderIcon />
          <span>Notifications</span>
        </button>

        <button onClick={toggleOverlay} className='side_button'>
          <AddCircleOutlineIcon />
          <span>Create</span>
        </button>
        <button className='side_button'>
          <LogoutIcon />
          <span>Logout</span>
        </button>

      </div>
      
      <div className='side_more'>
        <button onClick={() => navigate("/settings")} className='side_button'>
          <MenuIcon />
          <span>Settings</span>
        </button>
      </div>
    </div>
    {open && 
      <div className="addPost">
        <div className='topAddPost'>
          <span>Create A New Content</span>
          <span onClick={toggleOverlay}><CloseIcon /></span>
        </div>

        <input type="text" placeholder="Name of your story" onChange={(e) => setName(e.target.value)}/>

        <input type="textarea" placeholder="Enter a description of your post" onChange={(e) => setDescription(e.target.value)}/>
        <select value={mainType} onChange={(e) => setMainType(e.target.value)}>
            <option value="">Select main type</option>
            <option value="text">Text</option>
            <option value="audio">Audio</option>
            <option value="video">Video</option>
        </select>

        
        {mainType === 'text' && (
          <textarea style={{color: "black"}} placeholder="Enter your text content here" onChange={(e) => setMain(e.target.value)} />
        )}

        {mainType === 'audio' && (
          <input type='file' accept='audio/*' onChange={(e) => setMain(e.target.files[0])} />
        )}

        {mainType === 'video' && (
          <input type='file' accept='video/*' onChange={(e) => setMain(e.target.files[0])} />
        )}

        <h3>Scenarios</h3>
        <input type="text" placeholder="Enter a caption for your scenario choice" onChange={(e) => setScenarioCaption(e.target.value)}/>
        
        {scenarios.map((scenario, index) => (
            <div key={index} style={{marginTop: 10}} className="scenario-form">
              
              <input
                    type="text"
                    value={scenario.name}
                    onChange={(e) => handleScenarioChange(index, "name", e.target.value)}
                    placeholder={`Scenario ${index + 1} Name`}
              />
              <select value={scenario.type} onChange={(e) => handleScenarioChange(index, "type", e.target.value)}>
                <option value="">Select scenario type</option>
                <option value="text">Text</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
              </select>

              {scenario.type === 'text' && (
                <textarea value={scenario.main} onChange={(e) => handleScenarioChange(index, "main", e.target.value)} placeholder={`Scenario ${index + 1} Name`} />
              )}

              {(scenario.type === 'audio' || scenario.type === 'video') && (
                <>
                  <input
                    type="file"
                    accept={`${scenario.type}/*`}
                    onChange={(e) => handleScenarioChange(index, "main", e.target.files[0])}
                  />
                </>
              )}
              <button onClick={() => handleRemoveScenario(index)}>Remove</button>
            </div>
          ))}
          <button style={{marginTop: 10}} onClick={handleAddScenario}>Add Scenario</button>

        {/* <input type="file" id="file-input" onChange={handleImageChange}/>
        <label htmlFor="file-input" id="file">Select an Image</label>
        {image && <div className='div'><img src={imageUrl} alt="imae" /></div>} */}
        <button style={{marginTop: 10}} onClick={handleUpload} type="submit">Publish</button>
      </div>
    }
    </div>
  )
}