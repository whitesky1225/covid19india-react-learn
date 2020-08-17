import React,{Suspense} from 'react';
import ReactDOM from 'react-dom';
import App from './App'
// import {createStore,applyMiddleware} from 'redux';
// import rootReducer from './reducers';
import './i18n/i18n';
// import logger from 'redux-logger'
// import thunk from 'redux-thunk'
// import {composeWithDevTools} from 'redux-devtools-extension'
import { BrowserRouter as Router } from 'react-router-dom';
// const store = createStore(rootReducer,composeWithDevTools(applyMiddleware(logger,thunk)))

// const render = () => {
//     ReactDOM.render(<App 
//         onIncrement = { ()=>store.dispatch({type:'INCREMENT'}) } 
//         onDcrement = { ()=>store.dispatch({type:'DECREMENT'}) } 
//         value = { store.getState() }
//         />,
//         document.getElementById('root')
//     );
// }
// render()
// store.subscribe(render)
ReactDOM.render(
    <Suspense fallback={<div />}>
      <Router>
        <App />
      </Router>
    </Suspense>,
    document.getElementById('root')
);



