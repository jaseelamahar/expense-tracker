import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Switch,Link } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Welcome from './components/Welcome';
import UpdateProfilePage from './components/UpdateProfilePage';
import {AuthContextProvider} from "./components/auth-context";

const App = () => {
  return (
    <AuthContextProvider>
    <Router>
      <div className='navbar'>
    <nav>
      
        <Link to="/login">Login</Link>
        <Link to="/signup">Sign Up</Link>
        <Link to="/welcome">Welcome</Link>
        <Link to="/updateprofile">Update Profile</Link>
      
    </nav>
    </div>
      <Switch>
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="/welcome" component={Welcome} />
        <Route path="/updateprofile" component={UpdateProfilePage}/>
      
      </Switch>
    </Router>
    </AuthContextProvider>
  );
};

export default App;

