import './App.css';
import { useEffect, useState } from 'react';
import Login from './components/Login/Login' ;
import Main from './components/Main/Main'

const App = () => {

  const [signIn, setSignIn] = useState(localStorage.getItem("signIn") || 'false');

  useEffect(() => {
    localStorage.setItem("signIn", signIn)
  }, [signIn]);

  return (
    <div className="container">
      { signIn === "false" ? 
        <Login setSignIn={setSignIn}/>
      :
        <Main setSignIn={setSignIn}/>
      }
    </div>
  );
}

export default App;