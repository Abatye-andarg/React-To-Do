
import { useState } from "react";
import { auth } from './firebase';
import { signOut } from "firebase/auth";
import AuthForm from "./AuthForm";
import Upper from "./Components/Upper/Upper";
import './App.css';
function App() {
  const [user, setUser] = useState(auth.currentUser);

  const handleLogout = () => {
    signOut(auth).then(() => setUser(null));
  };

  return (
    <div className="app">
      {user ? (
        <>
          <button onClick={handleLogout} className = 'log-out'>Logout</button>
          <Upper user={user} />
        </>
      ) : (
        <AuthForm onAuthSuccess={setUser} />
      )}
    </div>
  );
}

export default App;
