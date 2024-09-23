
import { useState } from 'react'
import {
  Progress,
  Box,
  ButtonGroup,
  Button,
  Heading,
  Flex,
  FormControl,
  VStack,
  FormLabel,
  Icon,
  Input,
  Select,
  Switch,
  SimpleGrid,
  InputGroup,
  Textarea,
  useColorModeValue,
  Text,
  Alert,
  AlertIcon,
  useToast,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { useNavigate } from "react-router-dom";
import { HeaderWithSideBar } from "../../components/navigation/Headers";
import {MyDropZone} from "../../components/MyDropzone"
import { RichTextEditor } from '../../components/RichTextEditor';
import {CiCirclePlus} from "react-icons/ci"
import { RiDeleteBinLine } from 'react-icons/ri';
import { Loading } from '../../components/Loading';
import { addPost } from '../../functions/addPost';
import { auth } from "../../functions/firebase";
import { useAuthState } from "react-firebase-hooks/auth";


const Form1 = ({name, description, coverImage, type, mainContent, end, endType, setName, setDescription, setCoverImage, setType, setMainContent, setEnd, setEndType}) => {
    const [forEnd, setForEnd] = useState(false)
  
    const toggleForEnd = () => {
      if(forEnd){
        setEnd(null)
        setEndType(null)
        setForEnd(false)
      }else {
        setForEnd(true)
      }
    }
    return (
      <>
        <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
          Post Informations
        </Heading>

        <Flex direction={{base: 'column', md: 'row'}} gap={10}>
        <MyDropZone element={coverImage} width='40%' setElement={setCoverImage} type="image"/>
          <Box w={{base: '100%', md: '70%'}}>
          <FormControl>
          <Flex alignItems={'center'} direction={{base: 'column', md: 'row'}}>
            <FormLabel htmlFor="last-name" fontWeight={'normal'}>
              Name
            </FormLabel>
            <Input id="last-name" placeholder="Name of your story" value={name} onChange={(e) => setName(e.target.value)}/>
          </Flex>
          </FormControl>
          <FormControl >
            <FormLabel  fontWeight={'normal'}>
              Description
            </FormLabel>
            <Textarea h={'100%'} placeholder="A description of your story" value={description} onChange={(e) => setDescription(e.target.value)}/>
          </FormControl>
          </Box>
        </Flex>
        {/* <Flex mt="2%"  ustifyContent={'center'} alignItems={'center'} gap={{base: 2, md: 10}}>
          <FormLabel htmlFor="password" fontWeight={'normal'} >
            Will there be a scenario choice
          </FormLabel>
          <Switch size={{base: 'sm', md: 'md'}} />
          <FormControl >
            <Input id="email" type="email" />
          </FormControl>
        </Flex> */}
        <Flex direction={{base: 'column', md: 'row'}} mt={'5%'} gap={{base: 10, md: 130}}>
          <Box w={{base: '100%', md: '50%'}}>
          <Heading>Starting Video</Heading>
          <FormControl my={'3%'}>
            <FormLabel fontWeight={'normal'}>
              Choose the main type of your post
            </FormLabel>
            <Select onChange={(e) => {setMainContent(null) ; setType(e.target.value)}} placeholder='Select the type'>
            <option value='text'>Text</option>
            <option value='video'>Video</option>
            <option value='audio'>Audio</option>
            </Select>
          </FormControl>
          { type==='text' ? 
            <RichTextEditor element={mainContent} setElement={setMainContent}/>
            : type==='video' ?
            <MyDropZone element={mainContent} setElement={setMainContent} type="video"/>
            : type==='audio' ?
            <MyDropZone element={mainContent} setElement={setMainContent} type="audio"/>
            : ""
          }
          </Box>
          <Box w={{base: '100%', md: '50%'}}>
          <Heading>Common End Video</Heading>
          <Switch onChange={() => toggleForEnd()} />

          {forEnd &&
            <>
            <FormControl >
              <FormLabel mt={'2%'} fontWeight={'normal'}>
                Choose the end type of your post
              </FormLabel>
              <Select onChange={(e) => setEndType(e.target.value)} placeholder='Select the type'>
              <option value='text'>Text</option>
              <option value='video'>Video</option>
              <option value='audio'>Audio</option>
            </Select>
            </FormControl>
            { endType==='text' ? 
            <RichTextEditor element={end} setElement={setEnd}/>
            : endType==='video' ?
            <MyDropZone element={end} setElement={setEnd} type="video"/>
            : endType==='audio' ?
            <MyDropZone element={end} setElement={setEnd} type="audio"/>
            : ""
            }
            </>
          }
          </Box>
        </Flex>
      </>
    )
  }
  
  const Form2 = ({parents, scenarioCaption, scenarios, setParents, setScenarioCaption, setScenarios }) => {
    const [forNext, setForNext] = useState(true)
    const toast = useToast()
    const handleScenarioChange = (index, field, value) => {
      const newScenarios = [...scenarios];
      if(newScenarios[index]['isParent'] && field=='name'){
        newScenarios[index]['isParent'] = false
        setParents(prevParents => prevParents.filter(parent => parent !== newScenarios[index]['name']));
      }
      newScenarios[index][field] = value;
      setScenarios(newScenarios);
    };
  
    const handleAddScenario = () => {
      setScenarios([...scenarios, { name: "", main: null, type: "", nextCaption: "", parent: "", isParent: false }]);
    };
  
    const handleRemoveScenario = (index) => {
      setScenarios(scenarios.filter((_, i) => i !== index));
    };

    const addParent = (index, isParent, name) => {
      const par = parents
      if(name!=="") {
        if(!isParent){
          handleScenarioChange(index, "isParent", true)
          par.push(name)
          setParents(par)
        }
        else{
          handleScenarioChange(index, "isParent", false)
          setParents(prevParents => prevParents.filter(parent => parent !== name));
        }
      }
      else {
        toast({
          title: 'Account created.',
          description: "We've created your account for you.",
          status: 'success',
          duration: 10000, 
          isClosable: true,
          position: 'top',
          render: () => (
            <Alert borderRadius={15} mt={100} status='error' variant={'solid'}>
              <AlertIcon />
              <Box>
                <AlertTitle>No name</AlertTitle>
                <AlertDescription>Please first enter the name of the scenario</AlertDescription>
              </Box>
            </Alert>
        )
        })
      }
    }

    return (
      <>
        <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
          Scenarios Configuration
        </Heading>
        <Switch isChecked={forNext} onChange={() => setForNext(!forNext)}>Toggle to enable scenarios to your content ?</Switch>
        {forNext &&
          <Box  mt={'5%'}>
          (the main parent is the main video you choosed previously, if you add a scenario without choosing its parent, the main content will be assigned as parent)
          <FormControl my={'3%'}>
            <FormLabel  fontWeight={'normal'}>
              First Scenario Caption
            </FormLabel>
            <Input placeholder="Enter a Caption for the first scenario" value={scenarioCaption} onChange={(e) => setScenarioCaption(e.target.value)}/>
          </FormControl>
          <SimpleGrid columns={{base: 1, md: 3}} spacing={10}>
            {scenarios.map((scenario, index) => (
              <Flex direction={'column'} gap={5} w={'100%'} borderRadius={8} border={'1px solid #cccccc'}>
                <Flex alignItems={'center'} justifyContent={'space-between'}>
                  <Input w={'60%'} value={scenario.name} placeholder='Scenario name' onChange={(e) => handleScenarioChange(index, "name", e.target.value)} />
                  <RiDeleteBinLine cursor={'pointer'} size={'25px'} onClick={() => handleRemoveScenario(index)} color='red'/>
                </Flex>
                <Flex gap={2} justifyContent={'space-between'}>
                  <Select placeholder="Scenario type" value={scenario.type} onChange={(e) => handleScenarioChange(index, "type", e.target.value)}>
                    <option value="text">Text</option>
                    <option value="video">Video</option>
                    <option value="audio">Audio</option>
                  </Select>
                  <Select placeholder="Scenario parent" value={scenario.parent} onChange={(e) => handleScenarioChange(index, "parent", e.target.value)}>
                    {parents.map((parent) => (
                      <option value={parent}>{parent}</option>
                    ))}
                  </Select>
                </Flex>

                {scenario.type === 'text' && (
                  <>
                  <RichTextEditor element={scenario.main} handleScenarioChange={handleScenarioChange} index={index}/>
                  </>
                )}

                {(scenario.type === 'audio' || scenario.type === 'video') && (
                  <MyDropZone handleScenarioChange={handleScenarioChange} index={index} element={scenario.main} type={scenario.type} />
                )}
                <FormControl my={'3%'}>
                  <FormLabel fontWeight={'normal'}>
                    Toggle the switch to make this scenario a parent
                  </FormLabel>
                  <Flex alignItems={'center'} gap={3}>
                    <Switch isChecked={scenario.isParent} onChange={() => addParent(index, scenario.isParent,scenario.name)}/>
                    {scenario.isParent &&
                      <Input placeholder="Enter a next scenario Caption" value={scenario.nextCaption} onChange={(e) => handleScenarioChange(index, "nextCaption", e.target.value)}/>
                    }
                  </Flex>
                </FormControl>
              </Flex>
            ))}
            <VStack onClick={handleAddScenario} cursor={'pointer'} justifyContent={'center'} bg={useColorModeValue('gray.100', 'gray.700')} borderRadius={8} border={'1px solid #cccccc'} h={{base: '20px', md: '300px'}} w={'100%'}>
              <CiCirclePlus size={'50px'}/>
              <p>Click to add a new scenario</p>
            </VStack>
          </SimpleGrid>
          </Box>
        }
      </>
    )
  }
  
  const Form3 = ({files, setFiles}) => {
    const handleFileChange = (index, field, value) => {
      const newFiles = [...files];
      newFiles[index][field] = value;
      setFiles(newFiles);
    };
  
    const handleAddFile = () => {
      setFiles([...files, { name: "", file: null }]);
    };
  
    const handleRemoveFile = (index) => {
      setFiles(files.filter((_, i) => i !== index));
    };
    return (
      <>
        <Heading w="100%" textAlign={'center'} fontWeight="normal">
          Review and Attach files
        </Heading>
        <Text>Attach files that the user will see at a particular moment, it is advicable to reference the place in your story so that he stops and view them before</Text>
        {files.map((file, index) => (
          <Flex alignItems={'center'} justifyContent={'space-between'} gap={{base: 0, md: 10}}>
            <Input value={file.name} placeholder='File name(optional)' onChange={(e) => handleFileChange(index, 'name', e.target.value)}/>
            <Input type='file' value={file.file} onChange={(e) => handleFileChange(index, 'file', e.target.value)} />
            <RiDeleteBinLine size={'50px'} cursor={'pointer'} color='red' onClick={() => handleRemoveFile(index)} />
          </Flex>
        ))}
        <Button onClick={handleAddFile}>Add a file</Button>
        </>
    )
  }

export const CreatePost = () => {
    const navigate = useNavigate()
    const toast = useToast()
    const [step, setStep] = useState(1)
    const [progress, setProgress] = useState(33.33)
    const [ user ] = useAuthState(auth);

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState(null)
    const [mainContent, setMainContent] = useState(null)
    const [end, setEnd] = useState(null)
    const [endType, setEndType] = useState(null)
    const [scenarioCaption, setScenarioCaption] = useState("")
    const [coverImage, setCoverImage] = useState(null)
    const [scenarios, setScenarios] = useState([])
    const [files, setFiles] = useState([])
    const [parents, setParents] = useState(['main'])
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      if(!coverImage==null || name==="" || type==null || mainContent==null){
        toast({
          duration: 3000, 
          isClosable: true,
          position: 'top',
          render: () => (
            <Alert borderRadius={15} mt={100} status='error' variant={'solid'}>
              <AlertIcon />
              <Box>
                <AlertTitle>Empty</AlertTitle>
                <AlertDescription>Please fill in every field</AlertDescription>
              </Box>
            </Alert>
        )
        })
      }else {
        try{
            await addPost(user, name, description, type, mainContent, end, endType, scenarioCaption, coverImage, scenarios, files, navigate)
            .then(() => {
              toast({
                duration: 3000, 
                isClosable: true,
                position: 'top',
                render: () => (
                  <Alert borderRadius={15} mt={100} status='success' variant={'solid'}>
                    <AlertIcon />
                    <Box>
                      <AlertTitle>Waouhh !!</AlertTitle>
                      <AlertDescription>Your post has been published !</AlertDescription>
                    </Box>
                  </Alert>
              )
              })
            })
        } catch (error) {
          console.log(error);
          toast({
            duration: 20000, 
            isClosable: true,
            position: 'top',
            render: () => (
              <Alert borderRadius={15} mt={100} status='error' variant={'solid'}>
                <AlertIcon />
                <Box>
                  <AlertTitle>Something Went Wrong !</AlertTitle>
                  <AlertDescription>We are sorry but your post was not published, something went wrong</AlertDescription>
                </Box>
              </Alert>
          )
          })
        }
      }
      setLoading(false)
    }

    const back = () => {
      setStep(step - 1)
      setProgress(progress - 33.33)
    }

    const next = async (e) => {
      e.preventDefault()
      setStep(step + 1)
      if (step === 3) {
        setProgress(100)
      } else {
        setProgress(progress + 33.33)
      }
    }


    return(
      <Flex minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
        {loading &&
          <Loading />
        }
        <HeaderWithSideBar />
        <Box
            borderWidth="1px"
            rounded="lg"
            shadow="1px 1px 3px rgba(0,0,0,0.3)"
            p={{base: 4, md: 7}}
            w={'full'}
            as="form" 
            bg={useColorModeValue('white', 'gray.900')}
            mx={5}
            mt={"100px"}>
        <Progress hasStripe value={progress} mb="2%" mx="5%" isAnimated></Progress>
        {step === 1 ? 
        <Form1
          name = {name}
          description = {description}
          type = {type}
          mainContent = {mainContent}
          scenarioCaption = {scenarioCaption}
          end = {end}
          coverImage = {coverImage}
          setName = {setName}
          setDescription = {setDescription}
          setType = {setType}
          setMainContent = {setMainContent}
          setScenarioCaption = {setScenarioCaption}
          setEnd = {setEnd}
          endType={endType}
          setEndType={setEndType}
          setCoverImage = {setCoverImage}
        /> 
        : 
        step === 2 ? 
        <Form2
          parents={parents}
          scenarioCaption={scenarioCaption}
          scenarios={scenarios}
          setParents={setParents}
          setScenarioCaption={setScenarioCaption}
          setScenarios={setScenarios}
        /> 
        : 
        <Form3 
          files={files}
          setFiles={setFiles}
        />}
        <ButtonGroup mt="5%" w="100%">
          <Flex w="100%" justifyContent="space-between">
            <Flex>
              <Button
                onClick={back}
                isDisabled={step === 1}
                colorScheme="teal"
                variant="solid"
                w="7rem"
                mr="5%">
                Back
              </Button>
              <Button
                w="7rem"
                isDisabled={step === 3}
                onClick={next}
                colorScheme="teal"
                variant="outline">
                Next
              </Button>
            </Flex>
            {step === 3 ? (
              <Button
                w="7rem"
                colorScheme="red"
                variant="solid"
                onClick={onSubmit}>
                Submit
              </Button>
            ) : null}
          </Flex>
        </ButtonGroup>
        </Box>
      </Flex>
    )
}