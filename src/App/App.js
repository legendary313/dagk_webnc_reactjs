import React, { useState, useEffect } from 'react';
import { Router, Route, Link, Switch } from 'react-router-dom';

import  history  from '../Helpers/History';
import  authenticationService  from '../Services/Authentication_service';
import  PrivateRoute  from '../Components/PrivateRoute';
import  Dashboard  from '../Pages/DashboardPage/Dashboard';
import  LoginPage  from '../Pages/LoginPage/Login';
import  RegistrationPage from '../Pages/RegistrationPage/Registration';
import  BoardPage from '../Pages/BoardPage/Board';
import AccountPage from '../Pages/AccountPage/AccountPage';
function App () {

    const [currentUser,setCurrentUser] = useState(null);

    useEffect(() => {
        authenticationService.currentUser.subscribe(x => setCurrentUser(x));
    },[]);
    console.log(currentUser);
    const logout = () => {
        authenticationService.logout();
        history.push('/login');
    }

    return (
        <div>
            <Route>
            <div>
                {currentUser &&
                    <nav className="navbar navbar-expand navbar-dark bg-dark">
                        <div className="navbar-nav">
                            <div className="navbar-header">
                                <a className="navbar-brand">WEB NANG CAO</a>
                            </div>
                                <Link to="/" className="nav-item nav-link">Home</Link>
                                <Link to="/account" className="nav-item nav-link">Account</Link>
                                <a onClick={logout} className="nav-item nav-link">Logout</a>
                        </div>
                    </nav>
                }
                <div className="jumbotron">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 ">
                                    <Switch>
                                        <PrivateRoute exact path="/" component={Dashboard} />
                                        <Route path="/login" component={LoginPage} />
                                        <Route path="/register" component={RegistrationPage} />
                                        <Route path="/board/:id" component={BoardPage} />
                                        <Route path="/account" component={AccountPage} />
                                    </Switch>    
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </Route>
        </div>
    ) 
}

export default App;