import './App.css'

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <div className="logo autobg-[url('/vite.png')] inline-block"></div>
        </a>
        <a href="https://react.dev" target="_blank">
          <div className="logo autobg-[url(./assets/react.png)] inline-block"></div>
        </a>
        <a href="https://react.dev" target="_blank">
          <div className="logo autobg-[url('@/assets/vite.png')] inline-block"></div>
        </a>
      </div>
      <h1>Vite + React</h1>
    </>
  )
}

export default App
