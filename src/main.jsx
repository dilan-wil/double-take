import { StrictMode } from 'react'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const theme = extendTheme({
  colors: {
    bg: {
      50: "#F7FAFC",
      800: "#1A202C"
    }, 
    button: {
      100: "#4299e1",
      200: "blue"
    },
    text: {
      1: "",
      2: "#4A5568"
    }
  },
  components: {
    Drawer: {
      parts: ['dialog', 'header', 'body'],
      variants: {
        primary: {},
        secondary: {
          dialog: {
            maxW: 60,
          }
        } 
      },
    }
  }
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
