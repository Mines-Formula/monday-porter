import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import App from './App'

export function render(url) {
  const html = renderToString(
    <ChakraProvider value={defaultSystem}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </ChakraProvider>
  )

  return { html }
}