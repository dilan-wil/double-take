import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../functions/firebase"
import { HeaderWithSideBar } from "../../components/navigation/Headers";
import { getADocument } from "../../functions/getADocument";
import { 
  Box, 
  useColorModeValue,
  Flex,
  SimpleGrid 
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useParams } from "react-router-dom"

export const LiveWatch = () => {
    const [ live, setLive ] = useState(null)
    const [ user, setUser ] = useState(null)
    const [ userChoice, setUserChoice ] = useState(null)
    const [ loggedUser ] = useAuthState(auth)
    const { postId } = useParams()

    useEffect(() => {
      const fetchPostDoc = async () => {
        // get post document
        const doc = await getADocument(postId, "posts");
        console.log(doc)
        setLive(doc);
        // get post creator
        const user = await getADocument(post?.userId, "users")
        console.log(user)
        setUser(user)
      };
  
      fetchPostDoc();
    }, []);

      const onVote = (choice) => {

      }

    return(
      <Flex minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
        <HeaderWithSideBar />
        <Box w={"100%"} mt={20} p={{base: 0, md: 4}}>
          {loggedUser?.uid === live?.userId &&
            <Box w={"100%"}>
              <PostPlayer post={post} />
            </Box>
          }
          
        </Box>
      </Flex>
    )
}