import { useState, useEffect, useCallback } from "react"
import { Box, Flex, useColorModeValue,Image, AspectRatio } from "@chakra-ui/react"
import { useDropzone } from 'react-dropzone';
import { IoCloudUploadOutline } from "react-icons/io5";


export const MyDropZone = ({width, element, setElement, type, handleScenarioChange, index}) => {
    const [selected, setSelected] = useState(null)
    const onDrop = useCallback(acceptedFiles => {
      if(index > -1){
        handleScenarioChange(index, 'main', acceptedFiles[0])
      }else {
      setElement(acceptedFiles[0])
      }
      // Do something with the files
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({
      onDrop, 
      accept: type === 'image' 
            ? { 'image/*': ['.jpeg', '.jpg', '.png', '.svg', '.webp', '.avif'] } 
            : type === 'video' 
            ? { 'video/*': ['.mp4', '.mkv', '.avi', '.mov'] } 
            : type === 'audio' 
            ? { 'audio/*': ['.mp3', '.wav', '.ogg'] } 
            : {},
      maxFiles: 1
    })
  
    
    useEffect(() => {
      if (element) {
        const imageUrl = URL.createObjectURL(element);
        setSelected(imageUrl);
    
        // Clean up the object URL when the component unmounts or the image changes
        // return () => URL.revokeObjectURL(imageUrl);
      }
    }, [element]);
  
    return (
      <Box
            {...getRootProps()}
            style={{backgroundSize: 'cover'}}
            cursor={'pointer'} h={'200px'} textAlign={'center'} p={'20px'} border={'2px dashed #cccccc'} w={{base: '100%', md: width}} bg={selected ? `url(${selected})` : useColorModeValue('blue.50', "")}
          >
            <input {...getInputProps()} />
            {!selected ?
            <>
              {isDragActive ? (
                <p>Drop the {type} here...</p>
              ) : (
                <Flex direction={'column'} h={'100%'} justifyContent={'center'} alignItems={'center'}>
                <IoCloudUploadOutline size={'50px'}/>
                <p>{element && <>Upload the cover {type}, </>}Drag & drop the {type}, or click to select one</p>
                </Flex>
              )}
            </> 
            : <Box>
                {type=='video' &&
                    <video src={selected} controls style={{height: '150px', width: '100%'}}/>
                }
                {type=='audio' &&
                    <audio src={selected} controls style={{width: '100%'}}/>
                }
                Change
                </Box>  
              } 
          </Box>
    )
  }
  