import { Flex, Spinner } from "@chakra-ui/react"

export const Loading = () => {
    return (
        <Flex pos={'fixed'} minH={'100vh'}
        w={'full'}
        align={'center'}
        justify={'center'}
        bg={"rgba(0, 0, 0, 0.3)"}
        zIndex={10000}>
            <Spinner
            thickness='4px'
            speed='0.65s'
            emptyColor='gray.200'
            color='blue.500'
            size='xl'
          />
        </Flex>
    )
}