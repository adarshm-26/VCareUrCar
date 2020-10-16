import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Home,
  PrivateRoute,
  Login,
  Register,
  Profile,
  Jobs,
  Cars,
  Schedule,
  Verify,
  LogService,
  Pay,
  CheckMailVerification,
  Reports,
  Contact,
  Terms,
  About,
  Privacy,
  ServicePage
} from './components/Components';
import { AuthContext } from './context/auth';

const App = () => {
  const [token, setToken] = useState(undefined);

  useEffect(() => {
    let storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      signIn: (token) => {
        localStorage.setItem('token', token);
        setToken(token);
      },
      signOut: () => {
        localStorage.removeItem('token');
        setToken(undefined);
      }
    }}>
      <div className="App" style={{ fontFamily: 'Sansita' }}>
        <Router>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route path='/login' component={Login}/>
            <Route path='/register' component={Register}/>
            <Route path='/contact' component={Contact}/>
            <Route path='/terms' component={Terms}/>
            <Route path='/about' component={About}/>
            <Route path='/privacyPolicy' component={Privacy}/>
            <Route path='/services' component={ServicePage}/>
            <PrivateRoute path='/profile' component={Profile}/>
            <PrivateRoute path='/jobs' component={Jobs}/>
            <PrivateRoute path='/cars' component={Cars}/>
            <PrivateRoute path='/schedule' component={Schedule}/>
            <PrivateRoute path='/verify' component={Verify}/>
            <PrivateRoute path='/logService' component={LogService}/>
            <PrivateRoute path='/pay' component={Pay}/>
            <PrivateRoute path='/reports' component={Reports}/>
            <PrivateRoute path='/verifymail' component={CheckMailVerification} />
          </Switch>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
