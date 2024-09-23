import { 
    Flex,
    Box,
    Image,
    AspectRatio,
    Button,
    Grid, 
    useDisclosure,
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay,
    AlertDialogFooter
} from "@chakra-ui/react"
import { useState, useEffect } from "react"
import { getASubCollection } from "../functions/getASubCollection"


export const PostPlayer = ({ post }) => {
    const [scenarios, setScenarios] = useState([]);
    const [current, setCurrent] = useState(null);
    const [nextChoices, setNextChoices] = useState(null);
    const [scenarioChoice, setScenarioChoice] = useState(false)
    const {isOpen, onOpen, onClose} = useDisclosure()
    const [open, setOpen] = useState(false)
    useEffect(() => {
        const fetchScenarios = async () => {
            if(post && post.id){
                console.log(post)
                setCurrent({name: "main", type: post.type,main: post.mainContent, isParent: true, nextCaption: post.scenarioCaption})
                console.log(current)
                const scenes = await getASubCollection("posts", post && post.id ? post.id : "", "scenarios");
                setScenarios(scenes);
            }
        };
        fetchScenarios();
    }, [post]);

    // const handleContentEnded = () => {
    //     setScenarioChoice(true); // Show the scenario selection dialog
    // };

    const handleScenarioSelection = (selectedScenario) => {
        setCurrent(selectedScenario);
        onClose()
    };

    const renderScenarioSelection = () => {
        
        if (current?.isParent===false) {
            return null
        }
        const availableScenarios = scenarios.filter(scenario => scenario.parent === current?.name);
        

        return (
            <AlertDialog 
            motionPreset='slideInBottom'
            onClose={onClose}
            isOpen={isOpen}
            isCentered
            >
                <AlertDialogOverlay />
                <AlertDialogContent>
                    <AlertDialogHeader>Next Scenario Choice</AlertDialogHeader>
                
                <AlertDialogBody>
                    {current?.nextCaption}
                </AlertDialogBody>
                <AlertDialogFooter>
                    <Grid w='full' templateColumns={'repeat(2, 1fr)'} gap={5}>
                        {availableScenarios?.map((scenario) => (
                            <Button onClick={() => handleScenarioSelection(scenario)}>
                                {scenario.name}
                            </Button>
                        ))
                        }
                    </Grid>
                </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    };

    const renderContent = (content, type, onEnd) => {
        switch (type) {
            case "video":
                return (
                    <AspectRatio _before={{p: 0}} h={'65vh'} bg={'black'} w={'100%'} borderRadius={10}>
                        <video onEnded={onOpen} style={{ width: "auto", justifySelf: 'center' }} src={content} allowFullScreen controls/>
                    </AspectRatio>
                );
            case "audio":
                return (
                    <AspectRatio style={{alignItems: 'center'}} bg={'black'}  w={'100%'} >
                        <audio  style={{ width: "100%" }} src={content} controls/>
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

    return (
        <Box>
            
            {renderContent(current?.main, current?.type, onOpen)}
            
            {/* Render Scenario Selection Dialog */}
            {renderScenarioSelection()}
        </Box>
    );
};
