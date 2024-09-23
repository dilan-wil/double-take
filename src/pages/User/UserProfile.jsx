import { HeaderWithSideBar } from "../../components/navigation/Headers"
import { useParams } from "react-router-dom";
import { auth } from "../../functions/firebase"; 
import { sendPasswordResetEmail } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { getADocument } from "../../functions/getADocument";
import { deleteADoc } from "../../functions/deleteADoc";
import { 
    Flex, 
    Box,
    useColorModeValue,
    Avatar,
    Button,
    Text,
    Divider,
    Heading,
    SimpleGrid,
    FormControl,
    FormLabel,
    AvatarBadge,
    IconButton,
    Center,
    HStack,
    Input,
    Stack,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    ModalHeader,
    ModalContent,
    Textarea,
} from "@chakra-ui/react"
import { useState, useEffect, useRef } from "react";
import { updateADoc } from "../../functions/updateADoc";
import { Loading } from "../../components/Loading";
import { IoMdClose } from "react-icons/io";
import { getASubCollection } from "../../functions/getASubCollection";
import { PostCard } from "../../components/PostCard";

export const UserProfile = () => {
    const { userId } = useParams();
    const [ user ] = useAuthState(auth)
    const [userDoc, setUserDoc] = useState(null)
    const [profilePicture, setProfilePicture] = useState({})
    const [username, setusername] = useState(null)
    const [bio, setBio] = useState(null)
    const [loading, setLoading] = useState(false)
    const [sent, setSend] = useState(false)
    const [picture, setPicture] = useState(true)
    const [userPosts, setUserPosts] = useState([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [selectedTab, setSelectedTab] = useState('posts');  // Default to 'posts'
    const fileInputRef = useRef()
    const onUpdate = async(e) => {
        e.preventDefault()
        const test = {username, bio, profilePicture}
        for (var propName in test) {
            if (test[propName] === null || test[propName] === undefined ) {
              delete test[propName];
            }
        }
        setLoading(true)
        await updateADoc(userDoc.uid, test, setUserDoc)        
        setLoading(false)
    }

    const resetPassword = async () => {
        await sendPasswordResetEmail(auth, userDoc.email)
        setSend(true)
    }

    const handleOnClose = () => {
        setusername(null)
        setProfilePicture(null)
        setBio(null)
        setPicture(true)
        onClose()
    }

    useEffect(() => {
        const fetchUserDoc = async () => {
            console.log(userId)
            // get user document
            const doc = await getADocument(userId, "users");
            setUserDoc(doc);
            // get user post
            const posts = await getASubCollection("users", userId, "posts")
            console.log(posts)
            const postsDatas = await Promise.all(
                posts.map(async (post) => {
                  const postData = await getADocument(post.postId, "posts");
                  console.log(postData)
                  return postData;
                })
            );
            console.log(postsDatas);
            setUserPosts(postsDatas)
          };
      
          fetchUserDoc();
    }, [userId])

    return (
        <Flex minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            {loading &&
                <Loading />
            }
            <HeaderWithSideBar userDoc={userDoc}/>
            <Modal isOpen={isOpen} onClose={handleOnClose}>
                <ModalOverlay />
                <ModalContent mt={100}>
                    <ModalHeader>EDIT YOUR PROFILE</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                    <FormControl id="userName">
                    <FormLabel>Profile Photo</FormLabel>
                    <Stack direction={['column', 'row']} spacing={6}>
                        <Center>
                        <Avatar style={{backgroundSize: 'cover'}} bg={useColorModeValue('gray.200', 'gray.700')} size="xl" 
                            src={
                                profilePicture && profilePicture.name
                                ? URL.createObjectURL(profilePicture) 
                                : userDoc && userDoc.profilePicture && picture
                                ? userDoc.profilePicture 
                                : ""
                            }>
                            {picture &&
                                <AvatarBadge
                                as={IconButton}
                                size="sm"
                                rounded="full"
                                top="-10px"
                                colorScheme="red"
                                aria-label="remove Image"
                                onClick={() => {setProfilePicture({}); setPicture(false)}}
                                icon={<IoMdClose />}
                                />
                            }
                        </Avatar>
                        </Center>
                        <Center w="full">
                        <Button onClick={() => fileInputRef.current.click()} w="full">Change Icon</Button>
                        <Input accept='image/*' display='none' type='file' ref={fileInputRef} 
                            onChange={(e) => {setProfilePicture(e.target.files[0]); setPicture(true)}} 
                            />
                        </Center>
                    </Stack>
                    </FormControl>
                    <FormControl mt={5} id="userName" >
                    <FormLabel>User name</FormLabel>
                    <Input
                        placeholder={`@${userDoc && userDoc.username ? userDoc.username : ""}`}
                        _placeholder={{ color: 'gray.500' }}
                        onChange={(e) => setusername(e.target.value)}
                        type="text"
                    />
                    </FormControl>
                    <FormControl mt={5} id="bio" >
                    <FormLabel>Bio</FormLabel>
                    <Textarea
                        placeholder={userDoc && userDoc.bio ? userDoc.bio : ""}
                        _placeholder={{ color: 'gray.500' }}
                        onChange={(e) => setBio(e.target.value)}
                    />
                    </FormControl>
                    <Flex alignItems={'center'} gap={5}>
                        <Button
                            bg={'blue.400'}
                            color={'white'}
                            mt={5}
                            onClick={resetPassword}
                            w="40%"
                            _hover={{
                            bg: 'blue.500',
                            }}>
                            Reset Password
                        </Button>
                        {sent && <Text>Password Reset Email Has Been Sent To Your Email</Text>}
                    </Flex>
                    </ModalBody>

                    <ModalFooter gap={6}>
                    <Button
                        bg={'red.400'}
                        color={'white'}
                        onClick={handleOnClose}
                        w="full"
                        _hover={{
                        bg: 'red.500',
                        }}>
                        Cancel
                    </Button>
                    <Button
                        isDisabled={profilePicture == null && username == null && bio == null ? true : false}
                        bg={'blue.500'}
                        color={'white'}
                        onClick={onUpdate}
                        w="full"
                        _hover={{
                        bg: 'blue.600',
                        }}>
                        Update Profile
                    </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Box
                w={'full'}
                bg={useColorModeValue('white', 'gray.900')}
                pl={10}
                pr={10}
                pt={'100px'}
            >
                <Flex direction={{base: 'column', md: 'row'}} gap={{base: 6, md: 20}} justifyContent={'center'}>
                    <Flex justifyContent={'space-between'}>
                        <Avatar
                        w={{base: '100px', md: '200px'}}
                        h={{base: '100px', md: '200px'}}
                        bg={useColorModeValue('gray.200', 'gray.700')}
                        style={{backgroundSize: 'cover'}}
                        cursor={'pointer'}
                        src={userDoc && userDoc.profilePicture ? userDoc.profilePicture : ""} />
                        {userDoc && userDoc.uid == user.uid ?
                            <Button display={{base: "block", md: 'none'}} onClick={onOpen}>Edit Profile</Button>
                            : <Button display={{base: "block", md: 'none'}}>Follow</Button>
                        }
                    </Flex>
                    <Box justifyContent={'center'} w={{base: '', md: "600px"}}>
                        <Flex gap={"50px"} alignItems={'center'}>
                            <Box>
                                <Text fontWeight={'bold'} fontSize={'32px'}>{userDoc && userDoc.fullName ? userDoc.fullName : ""}</Text>
                                <Text>@{userDoc && userDoc.username ? userDoc.username : ""}</Text>
                            </Box>
                            {userDoc && userDoc.uid == user.uid ?
                                <Button display={{base: "none", md: 'block'}} onClick={onOpen}>Edit Profile</Button>
                                : <Button display={{base: "none", md: 'block'}}>Follow</Button>
                            }
                        </Flex>
                        <Text mt={{base: "10px", md: "20px"}} fontWeight={'bold'} fontSize={'16px'}>Bio</Text>
                        <Text>{userDoc && userDoc.bio ? userDoc.bio : ""}</Text>
                    </Box>
                </Flex>
                <Divider mt={{base: "10px", md: 100}}/>
                <Flex direction={'column'} alignItems={'center'}>
                    <Flex mb={{base: 2, md: 6}} gap={4}>
                        {/* "Posts" tab */}
                        <Heading
                            onClick={() => setSelectedTab('posts')}
                            fontWeight={selectedTab === 'posts' ? 'bold' : 'normal'}  // Bold if selected
                            fontSize={21}
                            cursor="pointer"
                        >
                            Posts
                        </Heading>
                        <Divider height={10} orientation='vertical' />
                        {/* "Live Events" tab */}
                        <Heading
                            onClick={() => setSelectedTab('liveEvents')}
                            fontWeight={selectedTab === 'liveEvents' ? 'bold' : 'normal'}  // Bold if selected
                            fontSize={21}
                            cursor="pointer"
                        >
                            Live Events
                        </Heading>
                    </Flex>
                    {selectedTab === 'posts' ? (
                    <SimpleGrid style={{width: "100%"}} columns={{base: 1, md:2, lg: 3, xl: 4}} spacing={{base: 10, md: 4}}>
                        {userPosts.map((post) => (
                            <PostCard post={post} creator={userId === post?.userId ? true : false} height={200} />
                        ))}
                    </SimpleGrid>
                    ) : (
                        <Heading>No live events at the moment!</Heading> // Replace with actual Live Events data if available
                    )}
                </Flex>
            </Box>
        </Flex>
    )
}