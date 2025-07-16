
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import './App.css';
import './index.css';


import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase'; 
import SignIn from './components/auth/SignIn'; 



import Home from "./pages/Home.js"
import Generator from "./pages/Generator.js";
import Almacenador from "./pages/Almacenador.js";
import Ajustes from "./pages/Ajustes.js";
import BottomNav from "./components/BottonNav.js";


function AppLayout() {

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

function App(){
  const [user,loading] = useAuthState(auth);

  if(loading){
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return(
    <>
      {user ? <AppLayout/> : <SignIn/>}
    </>
  )

}




export default App;
