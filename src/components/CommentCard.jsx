import { 
    Avatar,
    Text,
    Box,
    HStack,
    Flex,
    Input 
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { AiOutlineLike } from "react-icons/ai";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { getADocument } from "../functions/getADocument";
import { db } from "../functions/firebase";
import { setDoc, updateDoc, doc, increment,  } from "firebase/firestore";

export const CommentCard = ({comment, postId}) => {
    // comment takes userId at comment.userId and content at comment.content and like at comment.like
    const [user, setUser] = useState(null)
    const [liked, setLiked] = useState(false)
    const [com, setCom] = useState(null)
    useEffect(() => {
        const fetchUser = async () => {
            setCom(comment)
            const User = await getADocument(comment.userId, "users")
            setUser(User)
        }
        fetchUser()
    }, [])

    const like = async () => {
        setLiked(true)
        await updateDoc(doc(db, "posts", postId, "comments", comment.id), {
            likes: increment(1),
        })
        setCom({...com, likes: com.likes + 1})
    }
    const dislike = async () => {
        setLiked(false)
        await updateDoc(doc(db, "posts", postId, "comments", comment.id), {
            likes: increment(-1),
        })
        setCom({...com, likes: com.likes - 1})
    }

    return (
        <Flex mb={3} alignItems={'center'} gap={5} w={'100%'}>
            <Avatar src={user?.profilePicture} w={'30px'} h={'30px'}/>
            <Box>
                <Text fontSize={13} fontWeight={'bold'}>@{user?.username}</Text>
                <Text fontSize={14}>{com?.content}</Text>
                <Flex alignItems={'center'} gap={5}>
                    {liked 
                        ? <BiSolidLike cursor={'pointer'} onClick={() => dislike()}/>
                        : <BiLike cursor={"pointer"} onClick={() => like()}/> 
                    }
                    {com?.likes} likes
                </Flex>
            </Box>
        </Flex>
    )
}