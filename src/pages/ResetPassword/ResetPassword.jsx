'use client'

import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Link,
  Alert,
  AlertIcon,
  CloseButton,
  Spinner
} from '@chakra-ui/react'
import { useState } from 'react'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from "../../functions/firebase"
import { GrAnalytics } from 'react-icons/gr'
import { Loading } from '../../components/Loading'

export const ResetPassword = () => {
    const [email, setEmail] = useState("")
    const [alert, setAlert] = useState(false)
    const [alerte, setAlertE] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        setAlert(false)
        setAlertE(false)
        try {
            await sendPasswordResetEmail(auth, email)
            setAlert(true)
        } catch (error) {
            console.log(error.message)
            setAlertE(true)
        }
        setLoading(false)
    }

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      direction={'column'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
        {loading &&
          <Loading />
        }
        {alert &&
            <Alert borderRadius={10} w={{base: "90%", md: "50%"}} justifyContent={'space-between'} status='info'>
                <Flex>
                <AlertIcon />
                An email with a password reset email has been sent to your email ;)
                </Flex>
                <CloseButton alignSelf='flex-end'
                position='relative'
                right={-1}
                onClick={() => setAlert(false)}/>
            </Alert>
        }
        {alerte &&
            <Alert borderRadius={10} w={{base: "90%", md: "50%"}} justifyContent={'space-between'} status='error'>
                <Flex>
                <AlertIcon />
                Something went wrong, try again
                </Flex>
                <CloseButton alignSelf='flex-end'
                position='relative'
                right={-1}
                onClick={() => setAlert(false)}/>
            </Alert>
        }
      <Stack
        spacing={4}
        w={'full'}
        maxW={'md'}
        bg={useColorModeValue('white', 'gray.700')}
        rounded={'xl'}
        boxShadow={'lg'}
        p={6}
        my={12}>
        <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
          Forgot your password?
        </Heading>
        <Text
          fontSize={{ base: 'sm', sm: 'md' }}
          color={useColorModeValue('gray.800', 'gray.400')}>
          You&apos;ll get an email with a reset link
        </Text>
        <form onSubmit={onSubmit}>
        <FormControl id="email">
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: 'gray.500' }}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            isRequired
          /> 
        </FormControl>
        <Stack spacing={6}>
          <Button
            mt={15}
            bg={'blue.400'}
            color={'white'}
            type='submit'
            _hover={{
              bg: 'blue.500',
            }}>
            Request Reset
          </Button>
        </Stack>
        </form>
      </Stack>
    </Flex>
  )
}