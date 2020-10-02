import React,{ useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Home, PrivateRoute, Login, Register, Profile , Cars, AddCar,RemoveCar} from './components/Components';
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
            {/* <PrivateRoute path='/jobs' component={Jobs}/ >*/}
            <PrivateRoute path='/removeCar' component={RemoveCar}/> 
            <PrivateRoute path='/cars' component={Cars}/> 
            <PrivateRoute path='/addCar' component={AddCar}/>
            {/* <Route path='/services' component={Services}/>
            {/* <Route path='/profile' component={Profile}/> } */}
          </Switch>
        </Router>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
