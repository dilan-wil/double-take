import {
    Flex,
    Box,
    useColorModeValue,
    Grid,
    Text,
    GridItem,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalHeader,
    ModalFooter,
    ModalCloseButton,
    useDisclosure
} from "@chakra-ui/react"
import { useState, useEffect, useRef } from "react"
import { useParams } from "react-router-dom"
import { Header } from "../../components/navigation/Headers"
import { getADocument } from "../../functions/getADocument"
import { getASubCollection } from "../../functions/getASubCollection"
import { PostPlayer } from "../../components/PostPlayer"
// import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Comments } from "../../components/Comments"

export const ViewPost = () => {
    const { postId } = useParams()
    const [cinema, setCinema] = useState(false)
    const [post, setPost] = useState(null)
    const [user, setUser] = useState(null)
    const [comments, setComments] = useState([])
    const [postFiles, setPostFiles] = useState([])
    const [fileContent, setFileContent] = useState(null);
    const fileModal = useDisclosure()
    const boxRef = useRef(null);

    const handleReadFile = (file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            setFileContent(file);
        };
      
        reader.readAsText(file);
    }

    useEffect(() => {
        const fetchPostDoc = async () => {
            // get post document
            const doc = await getADocument(postId, "posts");
            console.log(doc)
            setPost(doc);
            // get post creator
            const user = await getADocument(post && post.userId ? post.userId : "", "users")
            console.log(user)
            setUser(user)
            //get post comments
            const coms = await getASubCollection("posts", postId, "comments")
            setComments(coms)
            // get post files
            const files = await getASubCollection("posts", postId, "files")
            setPostFiles(files)
          };
      
          fetchPostDoc();
    }, [])

    const modeCinema = (event) => {
        if (event.key === 't' || event.key === 'T') {
            setCinema(prevState => !prevState);
        }
    };

    useEffect(() => {
        const box = boxRef.current;
        if (box) {
            box.addEventListener('keydown', modeCinema);
        }

        return () => {
            if (box) {
                box.removeEventListener('keydown', modeCinema);
            }
        };
    }, []);

    // useEffect(() => {
    //     const handleKeyDown = (event) => {
    //         if (event.key === 't' || event.key === 'T') {
    //             setCinema(!cinema)
    //         }
    //     };

    //     // Add event listener for keydown when the component mounts
    //     window.addEventListener('keydown', handleKeyDown);

    //     // Cleanup the event listener when the component unmounts
    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //     };
    // }, [cinema]);

    return(
        <Flex minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            <Header />
            <Grid w={'100%'} px={{base: 0, md: 5}} mt={100} gap={10} templateColumns={{base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)'}}>
                <GridItem 
                    w={'100%'} 
                    borderRadius={10} 
                    colSpan={cinema ? 3 : 2}
                    tabIndex={0} // Make the Box focusable
                    onFocus={() => boxRef.current.focus()}
                    ref={boxRef}// Attach event listener when focused
                    // onBlur={handleBlur}
                    p={0}
                    _before={{padding: 0}}
                    _after={{padding: 0}}
                    
                >
                    <PostPlayer post={post} />
                </GridItem>
                <GridItem overflowY={'scroll'} p={10} w={'100%'} colSpan={2} colStart={{base: 1, md: 3}} borderRadius={5} h={'65vh'} border={'5px solid gray'} >
                    <Text fontSize={24} fontWeight={'bold'}>Additionals Files</Text>
                    {postFiles.map((file) => (
                        <Flex pb={2} justifyContent={'space-between'} alignItems={'center'}>
                            <Text fontSize={18}>{file.name}</Text>
                            <Button bg={'blue.100'} onClick={() => {setFileContent(file);fileModal.onOpen()}}>Open</Button>
                        </Flex>
                    ))
                    }
                </GridItem>
                <GridItem w={'100%'} rowStart={{base: 3, md: 2}} borderRadius={10} colSpan={2}>
                    <Comments postId={postId}/>
                </GridItem>
            </Grid>
            <Modal isOpen={fileModal.isOpen} onClick={() => {setFileContent(null);fileModal.onClose()}}>
                <ModalOverlay />
                <ModalContent mt={100}>
                    <ModalHeader>{fileContent?.name}</ModalHeader>
                    <ModalCloseButton  onClick={() => {setFileContent(null);fileModal.onClose()}}/>
                    <ModalBody>
                        {/* <DocViewer
                         documents={[{uri: "https://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf", fileType: "pdf", fileName: 'test'},]}
                         config={{
                            header: {
                              disableHeader: false,
                              disableFileName: false,
                              retainURLParams: false,
                            },
                          }}
                          pluginRenderers={DocViewerRenderers}
                          style={{height: "1000"}}
                         /> */}
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => {setFileContent(null);fileModal.onClose()}}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    )
}