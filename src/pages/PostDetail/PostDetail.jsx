import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../functions/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [showScenarioSelection, setShowScenarioSelection] = useState(false);
  const [showGetAChance, setShowGetAChance] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        // Fetch post details
        const postDoc = await getDoc(doc(db, "posts", postId));
        if (postDoc.exists()) {
          setPost({ id: postDoc.id, ...postDoc.data() });
          
          // Fetch scenarios subcollection
          const scenariosCollection = collection(db, "posts", postId, "scenarios");
          const scenariosSnapshot = await getDocs(scenariosCollection);
          const scenariosList = scenariosSnapshot.docs.map(doc => doc.data());
          setScenarios(scenariosList);
        }
      } catch (error) {
        console.error("Error fetching post or scenarios:", error);
      }
    };

    fetchPostData();
  }, [postId]);

  const handleVideoEnd = () => {
    setShowScenarioSelection(true);
  };

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    setShowScenarioSelection(false);
    setShowGetAChance(false);
    setCurrentScenarioIndex(0); // Reset to the first scenario
  };

  const handleNextScenario = () => {
    setShowScenarioSelection(true);
  };

  if (!post) return <div>Loading...</div>;

  const renderContent = (type, content) => {
    if (type === "text") {
      return (
        <div>
          <p>{content}</p>
          <button onClick={handleNextScenario}>Next</button>
        </div>
      );
    }
    if (type === "video") {
      return <video src={content} controls autoPlay className="post_video" onEnded={handleVideoEnd} />;
    }
    if (type === "audio") {
      return <audio src={content} controls autoPlay className="post_audio" onEnded={handleVideoEnd} />;
    }
    return null;
  };

  return (
    <div className="post_detail">
      {selectedScenario 
        ? renderContent(selectedScenario.type, selectedScenario.mainContent)
        : renderContent(post.type, post.mainContent)
      }

      <h2>{post.name}</h2>
      <p>Description: {post.description}</p>
      <p>Type: {post.type}</p>
      <p>Posted by: {post.uid}</p>

      {showScenarioSelection && (
        <div className="scenario_selection">
          <h3>{post.scenarioCaption}:</h3>
          {scenarios.map((scenario, index) => (
            <div>
            <button
              key={index}
              className="scenario_button"
              onClick={() => handleScenarioSelect(scenario)}
            >
              {scenario.name}
            </button><br/> 
            </div>
          ))}
        </div>
      )}
      {showGetAChance && (
        <div className="scenario_selection">
          <h3>Get a chance to see what could have happened if you choosed the other scenario:</h3>
          {scenarios.map((scenario, index) => (
            <div>
            <button
              key={index}
              className="scenario_button"
              onClick={() => handleScenarioSelect(scenario)}
            >
              {scenario.name}
            </button><br/> 
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
