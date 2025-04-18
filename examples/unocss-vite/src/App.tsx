import './App.css'

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" className="inline-block h100px" target="_blank">
          <div className="logo autobg-asp-[url('/vite.png')]-h50%"></div>
        </a>
        <a href="https://react.dev" className="inline-block h100px" target="_blank">
          <div className="logo autobg-asp-[url(./assets/react.png)]-w"></div>
        </a>
        <a href="https://react.dev" className="inline-block" target="_blank">
          <div className="logo autobg-[url('@/assets/vite.png')]"></div>
        </a>
      </div>
      <h1>Vite + React</h1>
    </>
  )
}

export default App
