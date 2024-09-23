import { 
    Avatar,
    Text,
    Box,
    VStack,
    Flex,
    Input, 
    Button,
    Alert,
    AlertIcon,
    useToast,
    AlertTitle,
    AlertDescription
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { CommentCard } from "./CommentCard"
import { addComment } from "../functions/addComment"
import { useAuthState } from "react-firebase-hooks/auth"
import {auth} from "../functions/firebase"
import { getADocument } from "../functions/getADocument"
import { getASubCollection } from "../functions/getASubCollection"

export const Comments = ({postId}) => {
    const [comments, setComments] = useState([])
    const toast = useToast()
    const [newComment, setNewComment] = useState("")
    const [user] = useAuthState(auth)
    const [userDoc, setUserDoc] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const onSubmit = async() => {
        await addComment(user.uid, postId, newComment)
        setNewComment("")
        setRefresh(!refresh)
        toast({
            duration: 1000, 
            isClosable: true,
            position: 'top',
            render: () => (
              <Alert borderRadius={15} mt={500} status='success' variant={'solid'}>
                <AlertIcon />
                <Box>
                  <AlertTitle>Comment Added</AlertTitle>
                  <AlertDescription>Your comment has been added</AlertDescription>
                </Box>
              </Alert>
          )
          })
    }

    useEffect(() => {
        const fetchUser = async () => {
            const currentUser = await getADocument(user.uid, "users")
            setUserDoc(currentUser)
        }
        fetchUser()
    }, [])
    useEffect(() => {
        const fetchComments = async () => {
            const allComments = await getASubCollection("posts", postId, "comments")
            setComments(allComments)
        }
        fetchComments()
    }, [refresh])

    return(
        <Box>
            <Flex mb={5} gap={5}>
                <Avatar src={userDoc && userDoc.profilePicture ? userDoc.profilePicture : ""}/>
                <Flex gap={2} direction={'column'} w={'100%'}>
                    <Input placeholder="Add a Comment" borderBottom={'1px solid grey'} value={newComment} onChange={(e) => setNewComment(e.target.value)}/>
                    <Button 
                    w={20}
                    h={5}
                    fontSize={13}
                    bg={'button.100'}
                    _hover={{
                        bg: 'button.200',
                        color: 'white'
                    }} 
                    onClick={() => onSubmit()}>Send</Button>
                </Flex>
            </Flex>
            <VStack>
                {comments.map((comment) => (
                    <CommentCard postId={postId} comment={comment}/>
                ))}
            </VStack>
        </Box>
    )
}