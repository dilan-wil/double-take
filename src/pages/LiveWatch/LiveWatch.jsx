import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../functions/firebase"
import { Header } from "../../components/navigation/Headers";
import { getADocument } from "../../functions/getADocument";
import { getASubCollection } from "../../functions/getASubCollection";
import { 
  Box, 
  useColorModeValue,
  Flex,
  AspectRatio,
  RadioGroup,
  Radio,
  Stack,
  Text,
  Button 
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom"
import { onSnapshot, doc, updateDoc, increment, serverTimestamp } from "firebase/firestore"; // For real-time updates from Firestore

export const LiveWatch = () => {
    const [ live, setLive ] = useState(null)
    const [ post, setPost ] = useState(null)
    const [ user, setUser ] = useState(null)
    const [ choice, setChoice ] = useState(false)
    const [ results, setResults ] = useState(false)
    const [ loggedUser ] = useAuthState(auth)
    const { liveId } = useParams()
    const [scenarios, setScenarios] = useState([]);
    const [current, setCurrent] = useState(null);
    const [timer, setTimer] = useState(10); // 10 seconds countdown
    const [selectedScenario, setSelectedScenario] = useState("");
    const [canVote, setCanVote] = useState(true); // Controls voting eligibility

    useEffect(() => {
      // fetch live content
      const fetchLiveDoc = async () => {
        // get post document
        const doc = await getADocument(liveId, "lives");
        setLive(doc);
      };
      
      fetchLiveDoc();
    }, [liveId]);

    // fetching user
    useEffect(() => {
      const fetchLiveDoc = async () => {
        const user = await getADocument(live && live.userId ? live.userId : "", "users")
        setUser(user)
      };
      
      fetchLiveDoc();
    }, [live]);


    // fetching post content
    useEffect(() => {
      // fetch post content in live
      const fetchPostDoc = async () => {
        // get post document
        const doc = await getADocument(live && live.postId ? live.postId : "", "posts");
        setPost(doc);
      };
      
      fetchPostDoc();
    }, [live]);

    // fetching scenario
    useEffect(() => {
      // get the post scenario
      const fetchScenarios = async () => {
        if(post && post.id){
            setCurrent({name: "main", type: post.type, main: post.mainContent, isParent: true, nextCaption: post.scenarioCaption})
            
            const scenes = await getASubCollection("posts", post && post.id ? post.id : "", "scenarios");
            setScenarios(scenes);
        }
      };
      fetchScenarios();
    }, [post]);


    // Listen for updates to the "choice" field in Firestore
    useEffect(() => {
      const choiceDocRef = doc(db, "lives", liveId); // Reference to the post document
      const unsubscribe = onSnapshot(choiceDocRef, (snapshot) => {
        const data = snapshot.data();
        if (data?.choice !== undefined) {
          setChoice(data.choice);
        }
      });

      return () => unsubscribe(); // Clean up the listener on unmount
    }, [liveId]);

    const startCountdownFromFirestore = async () => {
      const liveDocRef = doc(db, 'lives', liveId);
      // const liveSnap = await getADocument(liveId, "lives");
      onSnapshot(liveDocRef, (snapshot) => {
        const data = snapshot.data();
        
        if (data && data.countdownStart) {
          console.log("Countdown Start:", data.countdownStart);
      
          // Firestore Timestamp to JS Date
          const countdownStart = data.countdownStart.toDate();
          const currentTime = new Date();
      
          // Calculate elapsed time and remaining countdown
          const timeElapsed = Math.floor((currentTime - countdownStart) / 1000); // Time in seconds, add +6 for it to be at 0

          const remainingTime = Math.max(10 - timeElapsed, 0); // Assuming a 10 second countdown
          
          setTimer(remainingTime); // Set the countdown timer
      
          if (remainingTime > 0) {
            const countdown = setInterval(() => {
              setTimer((prev) => {
                if (prev === 1) {
                  clearInterval(countdown);
                  setCanVote(false); // Disable voting after countdown ends
                  calculateVotePercentages(); // Calculate vote percentages
                }
                return prev - 1;
              });
            }, 1000);
          } else {
            setCanVote(false); // Countdown already ended
            calculateVotePercentages(); // Show results
          }
        } else {
          console.log("No countdownStart field found in Firestore document");
        }
      });
    };

    // Function to update Firestore when video ends
    const handleVideoEnd = async () => {
      const liveDocRef = doc(db, 'lives', liveId);
      await updateDoc(liveDocRef, {
        choice: true,
        countdownStart: serverTimestamp(), // Store Firestore server timestamp for synchronization
      });
      setCanVote(true); // Allow voting initially
      startCountdownFromFirestore();
    };

    // vote function
    const onVote = async () => {
      if (canVote  &&   selectedScenario) {
        // Perform any logic when a user votes, such as updating Firestore or triggering other actions
        console.log(`User voted for scenario: ${selectedScenario}`);
        // Increment the vote in lives collection
        const liveDocRef = doc(db, 'lives', liveId);
        await updateDoc(liveDocRef, { [selectedScenario]: increment(1)});
  
        // After voting, hide the voting UI (or keep it visible depending on requirements)
        setCanVote(false);
      }
    }
    
    // Calculate vote percentages, ignoring 'postId', 'userId', and 'createdAt'
    const calculateVotePercentages = async () => {
      const updatedLiveDoc = await getADocument(liveId, "lives"); // Fetch updated document

      // Filter out 'postId', 'userId', and 'createdAt' fields
      const scenarioKeys = Object.keys(updatedLiveDoc).filter(
        (key) => key !== "postId" && key !== "userId" && key !== "createdAt" && key !== "countdownStart" && key !== "choice" && key !== "id"
      );

      // Calculate total votes
      const totalVotes = scenarioKeys.reduce((total, key) => total + updatedLiveDoc[key], 0);

      // Calculate percentage of votes for each scenario
      const percentages = {};
      scenarioKeys.forEach((key) => {
        percentages[key] = ((updatedLiveDoc[key] / totalVotes) * 100).toFixed(2); // Calculate percentage
      });

      setResults(percentages); // Store percentages for rendering
    };

    // render voting results
    const renderVoteResults = () => {
      return (
        <Box mt={5}>
          <Text>Voting Results:</Text>
          {Object.entries(results).map(([scenario, percentage]) => (
            <Text key={scenario}>
              {scenario}: {percentage}%
            </Text>
          ))}
        </Box>
      );
    };
    // voting ui
    const renderVotingUI = () => {
      return (
        <Box mt={5}>
          <Text>Time remaining to vote: {timer} seconds</Text>
        {canVote ? (
          <>
            <RadioGroup onChange={setSelectedScenario} value={selectedScenario}>
              <Stack direction="column">
                {scenarios.map((scenario) => (
                  <Radio key={scenario.name} value={scenario.name}>
                    {scenario.name}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
            <Button mt={4} onClick={onVote} isDisabled={!selectedScenario}>
              Submit Vote
            </Button>
          </>
          ) : (
            renderVoteResults()
          )
        }
        </Box>
      );
    };


    // render the content
    const renderContent = (content, type, onEnd) => {
      switch (type) {
          case "video":
              return (
                  <AspectRatio _before={{p: 0}} h={'65vh'} bg={'black'} w={'100%'} borderRadius={10}>
                      <video onEnded={handleVideoEnd} style={{ width: "auto", justifySelf: 'center' }} src={content} allowFullScreen controls/>
                  </AspectRatio>
              );
          case "audio":
              return (
                  <AspectRatio style={{alignItems: 'center'}} bg={'black'}  w={'100%'} >
                      <audio onEnded={handleVideoEnd} style={{ width: "100%" }} src={content} controls/>
                  </AspectRatio>
              );
          case "text":
              return (
                  <Box dangerouslySetInnerHTML={{__html: content}} />
              );
          default:
              return null;
      }
  };

    return(
      <Flex minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
        <Header />
        <Box w={"100%"} mt={20} p={{base: 0, md: 4}}>
          {loggedUser?.uid === live?.userId &&
            <Box w={"100%"}>
              {renderContent(current?.main, current?.type)}
            </Box>
          }
          {choice ? renderVotingUI() : "After the scenario ends, the choice selection will show up"}
        </Box>
      </Flex>
    )
}