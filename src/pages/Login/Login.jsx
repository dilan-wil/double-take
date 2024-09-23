'use client'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
  Alert,
  AlertIcon,
  CloseButton,
  InputRightElement,
  InputGroup,
  Icon
} from '@chakra-ui/react'
import { login } from '../../functions/login'
import { FiEye, FiEyeOff } from "react-icons/fi"
import { Loading } from '../../components/Loading'

export const Login = () => {
    
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [alert, setAlert] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const onSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setAlert(false)
        try {
            await login(email, password, navigate); // Pass navigate to signInUser
        } catch (error) {
            setAlert(true)
            console.log(error)
        }
        setLoading(false)
    }

    return(
        <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
            {loading &&
          <Loading />
        }
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Stack align={'center'}>
            <Heading fontSize={'4xl'}>Sign in to your account</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
                To fully enjoy our app ✌️
            </Text>
            </Stack>
            {alert &&
            <Alert borderRadius={10} justifyContent={'space-between'} status='error'>
                <Flex>
                <AlertIcon />
                Wrong email or password
                </Flex>
                <CloseButton alignSelf='flex-end'
                position='relative'
                right={-1}
                onClick={() => setAlert(false)}/>
            </Alert>
            }
            <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack spacing={4}>
                <form onSubmit={onSubmit}>
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
                    <Stack spacing={10}>
                    <Stack
                        direction={{ base: 'column', sm: 'row' }}
                        align={'start'}
                        justify={'space-between'}>
                        <Checkbox>Remember me</Checkbox>
                        <Text onClick={() => navigate("/auth/password-reset")} cursor={'pointer'} color={'blue.400'}>Forgot password?</Text>
                    </Stack>
                    <Button
                        bg={'button.100'}
                        type='submit'
                        color={'white'}
                        _hover={{
                        bg: 'button.200',
                        }}>
                        Sign in
                    </Button>
                    </Stack>
                </form>
                <Stack pt={6}>
                    <Text align={'center'}>
                        Not a user? <Link href='/auth/signup' color={'blue.400'}>Create an account</Link>
                    </Text>
                </Stack>
            </Stack>
            </Box>
        </Stack>
    </Flex>
    )
}