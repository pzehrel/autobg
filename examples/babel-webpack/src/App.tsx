import './App.css';
import styled from 'styled-components';
import autobg from '@autobg/babel.macro';

const Logo = styled.div`
  ${autobg('@/assets/logo.png')}
`

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo className='App-logo' />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
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
  );
}

export default App;
