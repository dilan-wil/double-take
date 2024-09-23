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

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

export const Home = () => {
    const [ posts, setPosts ] = useState([])
    const navigate = useNavigate()
    const query = useQuery();
    const type = query.get("type");

    useEffect(() => {
        const fetchPosts = async () => {
          try {
            const postsList = await getACollection("posts");
            setPosts(postsList);
          } catch (error) {
            console.error("Error fetching posts:", error);
          }
        };
    
        fetchPosts();
      }, []);

      const handlePostClick = (postId) => {
        navigate(`/post/${postId}`)
      }
      const filteredPosts = type ? posts.filter(post => post.type === type) : posts;

    return(
      <Flex minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
        <HeaderWithSideBar />
        <Box  style={{width: "100%"}} mt={20} p={{base: 0, md: 4}}>
            <SimpleGrid style={{width: "100%"}} w={'100%'} columns={{base: 1, md:2, lg: 3, xl: 4}} spacing={{base: 10, md: 4}}>
              {filteredPosts.map((post, index) => (
                <PostCard type={type} key={index} show={true} post={post} />
              ))}
            </SimpleGrid>
        </Box>
      </Flex>
    )
}