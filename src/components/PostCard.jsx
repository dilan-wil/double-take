import { 
    Box,
    Text,
    useColorModeValue,
    Flex,
    Image,
    Menu,
    MenuList,
    MenuItem,
    MenuButton,
    MenuDivider,
    Avatar,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogBody,
    AlertDialogHeader,
    AlertDialogFooter,
    useDisclosure,
    Button,
    useToast,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription
} from "@chakra-ui/react";
import { BsBan, BsThreeDotsVertical } from "react-icons/bs";
import { CgPlayList } from "react-icons/cg";
import { GoHistory } from "react-icons/go";
import { IoShareSocial } from "react-icons/io5";
import { MdReportGmailerrorred } from "react-icons/md";
import { TbHistoryToggle } from "react-icons/tb";
import { getADocument } from "../functions/getADocument";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBinLine } from 'react-icons/ri';
import { GrUpdate } from "react-icons/gr";
import { deleteADoc } from "../functions/deleteADoc";
import { addLive } from "../functions/addLive";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../functions/firebase";

export const PostCard = ({post, show, creator, type}) => {
    const deleteAlert = useDisclosure()
    const toast = useToast()
    const [user, setUser] = useState({}) // the creator of the video which is different from boolean creator
    const [clickUser, setClickUser] = useState(false)
    const [click, setClick] = useState(false)
    const [menu, setMenu] = useState(false)
    const [ loggedUser ] = useAuthState(auth)
    const navigate = useNavigate()

    const addToLive = async () => {
        await addLive(loggedUser.uid, post.id)
        .then(()=> {
            toast({
                duration: 3000, 
                isClosable: true,
                position: 'top',
                render: () => (
                  <Alert borderRadius={15} mt={100} status='success' variant={'solid'}>
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Waouhh !!</AlertTitle>
                      <AlertDescription>Your have added a new live event !</AlertDescription>
                    </Box>
                  </Alert>
              )
              })
        })
    }

    const menuTopList = [
        {name: "Add to Live Event", icon: GoHistory, action: addToLive},
        {name: "Save in watch later", icon: TbHistoryToggle, action: ""},
        {name: "Save to playlist", icon: CgPlayList, action: ""},
        {name: "Share", icon: IoShareSocial, action: ""},
    ]
    const menuBottomList = [
        {name: "Not Interested", icon: BsBan, action: ""},
        {name: "Do not recommend this channel", icon: BsBan, action: ""},
        {name: "Report", icon: MdReportGmailerrorred, action: ""},
    ]

    const menuForCreator = [
        {name: "Update Post", icon: GrUpdate, action: "", color: "blue"},
        {name: "Delete Post", icon: RiDeleteBinLine, action: deleteAlert.onOpen, color: "red"},
        {name: "Share", icon: IoShareSocial, action: ""},
    ]

    useEffect(() => {
        console.log(post)
        const fetchUser = async () => {
          try {
            const User = await getADocument(post.userId, "users");
            setUser(User);
          } catch (error) {
            console.error("Error fetching posts:", error);
          }
        };
    
        fetchUser();
      }, []);

    return (
        <Box 
            cursor='pointer'
            w={'100%'}
            borderRadius={{base: 0, md: 10}}
            mb={{base: 0, md: 10}}
            _hover={{
                bg: useColorModeValue('gray.300', 'gray.700')
            }}
            style={{width: "100%"}}
        >
            <Box onClick={() => navigate(`/posts/${post.id}`)} borderRadius={{base: 0, md: 10}} height={'200px'} w={'100%'} backgroundImage={post?.coverImage} backgroundSize={'cover'} backgroundPosition="center" backgroundRepeat="no-repeat" />
            <Flex  mt={{base: 2, md: 4}} justifyContent={'space-between'}>
                <Flex>
                    {show &&
                        <Avatar 
                        ml={{base: 2, md: 0}} 
                        src={user && user.profilePicture ? user.profilePicture : ""}
                        alignSelf={'center'} />
                    }
                        <Box ml={3}>
                            <Text onClick={() => navigate(`/posts/${post.id}`)} fontSize={{base: '85%', md: '100%'}} fontWeight={600}>{post && post.name ? post.name : ""}</Text>
                            {show &&
                                <Text onClick={() => navigate(`/user/${post.userId}`)} _hover={{color: 'red'}} fontSize={{base: '85%', md: '100%'}} color={useColorModeValue('gray.600','gray.400')}>{user && user.username ? `@${user.username}` : ""}</Text>
                            }
                            <Text fontSize={{base: '85%', md: '100%'}} color={useColorModeValue('gray.600','gray.400')}>0 views &#x2022; 2 weeks ago</Text>
                        </Box>
                </Flex>
                <Menu isLazy>
                    <MenuButton alignItems={'start'}><BsThreeDotsVertical /></MenuButton>
                    <MenuList>
                        {creator 
                            ? 
                            <>
                                {menuForCreator.map((menu) => (
                                    <MenuItem color={menu.color} onClick={menu.action} icon={<menu.icon />}>{menu.name}</MenuItem>
                                ))}
                            </>
                            :
                            <>
                                {menuTopList.map((menu) => (
                                    <MenuItem icon={<menu.icon />} onClick={menu.action}>{menu.name}</MenuItem>
                                ))}
                                <MenuDivider />
                                {menuBottomList.map((menu) => (
                                    <MenuItem icon={<menu.icon />}>{menu.name}</MenuItem>
                                ))}
                            </>
                        }
                    </MenuList>
                </Menu>
                <AlertDialog
                    isOpen={deleteAlert.isOpen}
                    onClose={deleteAlert.onClose}
                >
                    <AlertDialogOverlay>
                    <AlertDialogContent mt={100}>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        Delete Post !
                        </AlertDialogHeader>

                        <AlertDialogBody>
                        Are you sure you want to delete this post ? This action can not be undo !
                        </AlertDialogBody>

                        <AlertDialogFooter>
                        <Button onClick={deleteAlert.onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={() => deleteADoc(post.id, "posts")} ml={3}>
                            Yes, Delete ! 
                        </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                    </AlertDialogOverlay>
                </AlertDialog>
            </Flex>
        </Box>
    )
}