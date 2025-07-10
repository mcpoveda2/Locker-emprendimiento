import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import './index.css';


import Home from "./pages/Home.js"
import Generator from "./pages/Generator.js";
import Almacenador from "./pages/Almacenador.js";
import Ajustes from "./pages/Ajustes.js";
import BottomNav from "./components/BottonNav.js";


function App() {

  return (
    <>
      <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generator" element={<Generator />} />
            <Route path="/almacenador" element={<Almacenador />} />
            <Route path="/ajustes" element={<Ajustes />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
    </>
  )
}

export default App;
