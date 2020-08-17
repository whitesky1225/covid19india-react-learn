import React from 'react'
import {Route} from 'react-router-dom'
import App from './App'
import SignupPage from './signup/SignupPage'

export default(
    <div className="container">
        <Route exact path="/" component={App}></Route>
        <Route exact path="/signup" component={SignupPage}></Route>
    </div>
)