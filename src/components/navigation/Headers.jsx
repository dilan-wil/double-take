'use client'

import {
  IconButton,
  Avatar,
  Box,
  CloseButton,
  Flex,
  HStack,
  VStack,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerCloseButton,
  useDisclosure,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Input,
  FormControl,
  InputGroup,
  InputRightElement,
  Button,
  useColorMode,
  Divider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
} from '@chakra-ui/react'
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiBell,
  FiChevronDown,
  FiSearch,
  FiVideo,
} from 'react-icons/fi'
import { BsSun, BsMoonStarsFill, BsJournalText } from 'react-icons/bs'
import { useState, useEffect } from 'react'
import "./Nav.css" 
import { useNavigate } from "react-router-dom";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, storage, db } from "../../functions/firebase";
import { AiFillAudio } from 'react-icons/ai'
import { GoHistory } from 'react-icons/go'
import { CgPlayList } from 'react-icons/cg'
import { TbHistoryToggle } from 'react-icons/tb'
import { BiLike } from "react-icons/bi";
import { IoPerson } from "react-icons/io5";
import { CiCirclePlus } from "react-icons/ci";
import { getADocument } from '../../functions/getADocument'
import { signOut } from 'firebase/auth'


const SidebarContent = ({ toggle, onClose, ...rest }) => {
  const [test] = useAuthState(auth)
  const LinkItemsTop = [
    { name: 'Home', icon: FiHome, link: "/" },
    { name: 'Video Contents', icon: FiVideo, link: "/?type=video" },
    { name: 'Audio Contents', icon: AiFillAudio, link: "/?type=audio" },
    { name: 'Text Contents', icon: BsJournalText, link: "/?type=text" },
  ]
  const LinkItemsMiddle = [
    { name: 'History', icon: GoHistory, link: "/history" },
    { name: 'Playlist', icon: CgPlayList, link: "/playlists" },
    { name: 'Follows', icon: FiCompass, link: "/follows" },
    { name: 'To see later', icon: TbHistoryToggle, link: "/later" },
    { name: 'Videos liked', icon: BiLike, link: "/liked" },
  ]
  const LinkItemsDown = [
    { name: 'Create New Post', icon: CiCirclePlus, link: "/studio/create-post" },
    { name: 'Profile', icon: IoPerson, link: `/user/${test.uid}` },
    { name: 'Settings', icon: FiSettings, link: "/settings" }
  ]
  return (
    <Box
      transition={toggle ? "1s ease" : ""}
      mt={20}
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: toggle ? "60px" : 60 }}
      pos="fixed"
      h="full"
      {...rest}>
      <Flex display={{base: "block", md: 'none'}} h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
          Double Take
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItemsTop.map((link) => (
        <NavItem toggle={toggle} key={link.name} icon={link.icon} link={link.link}>
          {link.name}
        </NavItem>
      ))}
      <Divider />
      {LinkItemsMiddle.map((link) => (
        <NavItem toggle={toggle} key={link.name} icon={link.icon} link={link.link}>
          {link.name}
        </NavItem>
      ))}
      <Divider />
      {LinkItemsDown.map((link) => (
        <NavItem toggle={toggle} key={link.name} icon={link.icon} link={link.link}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

const NavItem = ({ toggle, icon, link, children, ...rest }) => {
  return (
    <Box
      as="a"
      href={link}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}>
      <Flex
        align="center"
        p="4"
        mx={toggle ? "0" : "4"}
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
        {...rest}>
        {icon && (
          <Icon
            mr="4"
            fontSize={toggle ? "24" : "20"}
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {toggle ? "" : children}
      </Flex>
    </Box>
  )
}

export const Header = ({ userDoc, toggle, handleToggle, onOpen1, ...rest }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const drawer = useDisclosure()
  const alert = useDisclosure()
  const [ log, setLog ] = useState(false)
  const [user] = useAuthState(auth)
  const [userInfo, setUserInfo] = useState(null)
  useEffect(() => {
    console.log(userDoc)
    const fetchUserDoc = async () => {
      if(userDoc){
        setUserInfo(userDoc)
        console.log(userInfo)
      } else {
        const doc = await getADocument(user.uid, "users");
        console.log(doc)
        setUserInfo(doc)
        console.log(userInfo)
      }
        console.log(userDoc)
      };
  
      fetchUserDoc();
  }, [user])
  return (
    <Flex
      px={{ base: 4, md: 4 }}
      pos={'fixed'}
      w={'full'}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      zIndex={10000}
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between', md: 'space-between' }}
      {...rest}>
        <HStack>
        <IconButton
          onClick={(toggle && toggle.present) ? handleToggle : drawer.onOpen}
          variant="outline"
          display={{ base: 'none', md: 'flex' }}
          aria-label="open menu"
          icon={<FiMenu/>}
        />
        <IconButton
          onClick={drawer.onOpen}
          variant="outline"
          display={{ base: 'flex', md: 'none' }}
          aria-label="open menu"
          icon={<FiMenu/>}
        />

        <Text
          display={{ base: 'flex', md: 'block' }}
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold">
          Double Take
        </Text>
        </HStack>

        <Drawer
          isOpen={drawer.isOpen}
          placement='left'
          onClose={drawer.onClose}
          variant='secondary'
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton onClick={drawer.onClose}/>
            <DrawerHeader>
              <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                Double Take
              </Text>
            </DrawerHeader>
            <SidebarContent />
          </DrawerContent>
      </Drawer>

        <FormControl w={{ base: 4, md: "50%" }} display={{base: 'none', md: 'block'}} id="password" isRequired>
              <InputGroup>
                <Input placeholder='Search contents' display={{base: 'none', md: 'block'}} onChange={(e) => setPassword(e.target.value)} type="search" />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => {}}>
                    <Icon as={FiSearch}/>   
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Button
        aria-label="Toggle Color Mode"
        onClick={toggleColorMode}
        _focus={{ boxShadow: 'none' }}
        w="fit-content">
        {colorMode === 'light' ? <BsMoonStarsFill /> : <BsSun />}
      </Button>
      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton size="lg" variant="ghost" aria-label="open menu" icon={<FiBell />} />
        <IconButton display={{ base: 'block', md: 'none' }} size="lg" variant="ghost" aria-label="open menu" icon={<FiSearch />} />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton py={2} transition="all 0.3s" _focus={{ boxShadow: 'none' }}>
              <HStack>
                <Avatar
                  size={'sm'}
                  bg={useColorModeValue('gray.200', 'gray.700')}
                  src={userInfo && userInfo.profilePicture ? userInfo.profilePicture : ''}
                />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2">
                  <Text fontSize="sm">{userInfo && userInfo.fullName ? userInfo.fullName : ''}</Text>
                  <Text fontSize="xs" color="gray.600">
                  @{userInfo && userInfo.username ? userInfo.username : ''}
                  </Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}>
              <MenuItem as='a' href={user && user.id ? `/user/${user.uid}` : ""}>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuDivider />
              <MenuItem onClick={alert.onOpen}>Sign out</MenuItem>
            </MenuList>
          </Menu>
          <AlertDialog
            isOpen={alert.isOpen}
            onClose={alert.onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent mt={100}>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                  LOG OUT !
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure you want to log out from your account ?.
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button onClick={alert.onClose}>
                    Cancel
                  </Button>
                  <Button colorScheme='red' onClick={() => signOut(auth)} ml={3}>
                    Log out 
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Flex>
      </HStack>
    </Flex>
  )
}

export const HeaderWithSideBar = ({userDoc}) => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ toggle, setToggle ] = useState({present: true, value: false})
  const handleToggle = () => {
    setToggle({present : true, value: !toggle.value})
  }

  return (
    <Box mr={{base: 0 , md: toggle.value ? "60px" : 60}} >
      <SidebarContent toggle={toggle.value} onClose={onClose} display={{ base: 'none', md: 'block' }} />
      {/* Header */}
      <Header userDoc={userDoc} toggle={toggle} handleToggle={handleToggle} onOpen1={onOpen} />
    </Box>
  )
}