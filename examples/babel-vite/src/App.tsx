import autobg from '@autobg/babel.macro'
import styled from 'styled-components'
import './App.css'

const ViteLogo = styled.div`
  ${autobg('/vite.png')};
  display: inline-block;
`

const ReactLogo = styled.div`
  ${autobg('@/assets/react.png')};
  display: inline-block;
`
const ReactLogo2 = styled.div`
  ${autobg('./assets/react.png')};
  display: inline-block;
`

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <ViteLogo className="logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <ReactLogo className="logo react"></ReactLogo>
        </a>
        <a href="https://react.dev" target="_blank">
          <ReactLogo2 className="logo react"></ReactLogo2>
        </a>
      </div>
      <h1>Vite + React</h1>
    </>
  )
}

export default App
