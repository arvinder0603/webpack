import './App.css';
import React, { lazy } from 'react';
import logo from '../../public/uniform.jpg';
import Button from './shared/Button';

const Test = lazy(() => import(/* webpackChunkName: "test" */'./shared/Test'));

const AppComponent = () => {
    console.log(process.env.NODE_ENV);
    const consolingSomething = () => {
        console.log("I am consoling something");
    }
    return (
        <div className="container" >
            <h1>Hello World</h1>
            <img 
                style={{width: "100px", height: "100px"}}
                src={logo}
                alt="logo"
            />
            <Button />
            <dashboardComponent />
            <Test />
        </div>
    )
}

export default AppComponent;