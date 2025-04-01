import autobg from '@autobg/babel.macro'
import styled from 'styled-components'
import './App.css'

const Logo = styled.div`
  ${autobg('@/assets/logo.png')}
  display: inline-block;
`
// webpack Error: You attempted to import /logo.png which falls outside of the project src/ directory. Relative imports outside of src/ are not supported.
// const Logo2 = styled.div`
//   ${autobg('/logo.png')}
//   display: inline-block;
// `
const Logo3 = styled.div`
  ${autobg('./assets/logo.png')}
  display: inline-block;
`

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo className="App-logo" />
        {/* <Logo2 className="App-logo" /> */}
        <Logo3 className="App-logo" />
        <p>
          Edit
          {' '}
          <code>src/App.tsx</code>
          {' '}
          and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  )
}

export default App
