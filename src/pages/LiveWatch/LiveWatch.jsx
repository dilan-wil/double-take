import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../functions/firebase"
import { collection, getDocs } from "firebase/firestore"
import { HeaderWithSideBar, Header } from "../../components/navigation/Headers";
import { getACollection } from "../../functions/getACollection";
import { PostCard } from "../../components/PostCard";
import { 
  Box, 
  useColorModeValue,
  Flex,
  SimpleGrid 
} from "@chakra-ui/react";
import { useLocation } from 'react-router-dom';

export const LiveWatch = () => {
    const [ post, setPost ] = useState(null)
    const [ userChoice, setUserChoice ] = useState(null)

    useEffect(() => {
        const fetchPosts = async () => {
        //   try {
        //     const postsList = await getACollection("posts");
        //     setPosts(postsList);
        //   } catch (error) {
        //     console.error("Error fetching posts:", error);
        //   }
        };
    
        fetchPosts();
      }, []);

      const handlePostClick = (postId) => {
        navigate(`/live/${postId}`)
      }

      const onVote = (choice) => {

      }

    return(
      <Flex minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
        <HeaderWithSideBar />
        <Box mt={20} p={{base: 0, md: 4}}>
            
        </Box>
      </Flex>
    )
}