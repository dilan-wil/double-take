'use client'

import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Icon,
  Alert,
  AlertIcon,
  CloseButton
} from '@chakra-ui/react'
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { signIn } from "../../functions/signIn";
import { FiEye, FiEyeOff } from "react-icons/fi"
import { Loading } from '../../components/Loading';

export const SignUp = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("")
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [CPassword, setCPassword] = useState("")
    const [alert, setAlert] = useState(false)
    const [alert1, setAlert1] = useState(false)
    const [palert, setPAlert] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setAlert(false)
        setAlert1(false)
        if(CPassword === password){
            try {
                await signIn(name, email, password, username, navigate); // Pass navigate to signUpUser
            } catch (error) {
                console.log(error.code);
                if(error.code=="auth/weak-password"){
                    setAlert1(true)
                }
                else{
                    setAlert(true)
                }
            }
          setLoading(false)
        }
        else {
            setPAlert(true)
        }
    }

    return(
        <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('bg.50', 'bg.800')}>
        {loading &&
          <Loading />
        }
      <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'} textAlign={'center'}>
            Sign up
          </Heading>
          <Text fontSize={'lg'} color={'gray.600'}>
            To immerse in the new world of cinematography ✌️
          </Text>
        </Stack>
        {alert &&
            <Alert borderRadius={10} justifyContent={'space-between'} status='error'>
                <Flex>
                <AlertIcon />
                This username or email already 
                </Flex>
                <CloseButton alignSelf='flex-end'
                position='relative'
                right={-1}
                onClick={() => setAlert(false)}/>
            </Alert>
        }
        {alert1 &&
            <Alert borderRadius={10} justifyContent={'space-between'} status='warning'>
                <Flex>
                <AlertIcon />
                Please Password should be at least 6 letters
                </Flex>
                <CloseButton alignSelf='flex-end'
                position='relative'
                right={-1}
                onClick={() => setAlert1(false)}/>
            </Alert>
        }
        <Box
          rounded={'lg'}
          bg={useColorModeValue('white', 'text.2')}
          boxShadow={'lg'}
          p={8}>
          <Stack spacing={4}>
            <form onSubmit={onSubmit}>
            <FormControl id="fullName" isRequired>
                <FormLabel>Full Name</FormLabel>
                <Input onChange={(e) => setName(e.target.value)} type="text" />
            </FormControl>
           <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input onChange={(e) => setUsername(e.target.value)} type="text" />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input onChange={(e) => setEmail(e.target.value)} type="email" />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input onChange={(e) => setPassword(e.target.value)} type={showPassword ? 'text' : 'password'} />
                <InputRightElement h={'full'}>
                  <Button
                    variant={'ghost'}
                    onClick={() => setShowPassword((showPassword) => !showPassword)}>
                    {showPassword ? <Icon as={FiEye}/> : <Icon as={FiEyeOff} />}   
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl isInvalid={palert} id="cpassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input onChange={(e) => setCPassword(e.target.value)} type='password' />
              </InputGroup>
            </FormControl>
            <Stack spacing={10} pt={2}>
              <Button
                loadingText="Submitting"
                type='submit'
                size="lg"
                bg={'button.100'}
                color={'white'}
                _hover={{
                  bg: 'button.200',
                }}>
                Sign up
              </Button>
            </Stack>
            </form>
            <Stack pt={6}>
              <Text align={'center'}>
                Already a user? <Link href='/auth/login' color={'blue.400'}>Login</Link>
              </Text>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
    )
}