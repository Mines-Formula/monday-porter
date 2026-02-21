import './index.css'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

hydrateRoot(
  document.getElementById('root'),
  <ChakraProvider value={defaultSystem}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ChakraProvider>
)