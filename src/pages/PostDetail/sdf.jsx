import { 
    Flex,
    Box,
    Button,
    AspectRatio,
    Text,
    VStack 
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getASubCollection } from "../functions/getASubCollection";

export const PostPlayer = ({ post }) => {
    const [scenarios, setScenarios] = useState([]);
    const [currentScenario, setCurrentScenario] = useState(null);
    const [nextChoice, setNextChoice] = useState(null);

    useEffect(() => {
        const fetchScenarios = async () => {
            if (post && post.id) {
                const scenes = await getASubCollection("posts", post.id, "scenarios");
                setScenarios(scenes);
            }
        };
        fetchScenarios();
    }, [post]);

    const handleMainContentEnd = () => {
        // Filter scenarios where the parent is 'main'
        const initialChoices = scenarios.filter(scenario => scenario.parent === "main");
        setNextChoice({ caption: post.scenarioCaption, choices: initialChoices });
    };

    const handleScenarioChoice = (scenario) => {
        setCurrentScenario(scenario);

        // If the selected scenario is a parent, show the next scenario choices
        if (scenario.isParent) {
            const nextScenarios = scenarios.filter(s => s.parent === scenario.name);
            setNextChoice({ caption: scenario.nextScenarioCaption, choices: nextScenarios });
        } else {
            // No more scenarios, end here
            setNextChoice(null);
        }
    };

    return (
        <Box>
            {!currentScenario && (
                <>
                    {post && post.type === "video" && (
                        <AspectRatio w="100%" borderRadius={10} h="65vh">
                            <video
                                onEnded={handleMainContentEnd}
                                style={{ borderRadius: 10, width: "auto", justifySelf: 'center' }}
                                src={post.mainContent || ""}
                                allowFullScreen
                                controls
                            />
                        </AspectRatio>
                    )}
                    {post && post.type === "audio" && (
                        <AspectRatio w="100%" borderRadius={10} h="65vh">
                            <audio
                                onEnded={handleMainContentEnd}
                                style={{ width: "auto", justifySelf: 'center' }}
                                src={post.mainContent || ""}
                                controls
                            />
                        </AspectRatio>
                    )}
                    {post && post.type === "text" && (
                        <Box>{post.mainContent}</Box>
                    )}
                </>
            )}

            {currentScenario && (
                <Box>
                    <Text>{currentScenario.main}</Text>
                </Box>
            )}

            {nextChoice && (
                <VStack>
                    <Text>{nextChoice.caption}</Text>
                    {nextChoice.choices.map((scenario) => (
                        <Button key={scenario.name} onClick={() => handleScenarioChoice(scenario)}>
                            {scenario.name}
                        </Button>
                    ))}
                </VStack>
            )}
        </Box>
    );
};
