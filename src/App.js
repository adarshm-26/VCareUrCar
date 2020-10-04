import React,{ useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Home, PrivateRoute, Login, Register, Profile, Jobs } from './components/Components';
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
            <PrivateRoute path='/profile' component={Profile}/>
            <PrivateRoute path='/jobs' component={Jobs}/>
            {/*<PrivateRoute path='/cars' component={Cars}/> */}
            {/* <Route path='/services' component={Services}/>*/}
          </Switch>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
