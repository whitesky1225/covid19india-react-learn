import React,{lazy,Suspense,useState} from "react";
import { withTranslation } from "react-i18next";
import './App.scss'
import Home from "./components/Home";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import Navbar from './components/Navbar';
import useDarkMode from 'use-dark-mode';
// import Blog from './components/Blog';

const LanguageSwitcher = lazy(() => import('./components/LanguageSwitcher'));
const Blog = lazy(()=>import('./components/Blog'))
const About = lazy(()=>import('./components/About'))
function App({ t }){
  const [showLanguageSwitcher, setShowLanguageSwitcher] = useState(false);
  const pages = [
    {
    pageLink: '/',
    view: Home,
    displayName: 'Home',
    showInNavbar: true,
    },
    {
      pageLink: '/blog',
      view: Blog,
      displayName: 'Blog',
      showInNavbar: true,
    },
    {
      pageLink: '/about',
      view: About,
      displayName: 'About',
      showInNavbar: true,
    },
    // {
    //   pageLink: '/state/:stateCode',
    //   view: State,
    //   displayName: 'State',
    //   showInNavbar: false,
    // },
]
  const darkMode = useDarkMode(false);
  const location = useLocation()
  return(
    <div className="App">
     <Suspense fallback={<div />}>
      <LanguageSwitcher {...{showLanguageSwitcher,setShowLanguageSwitcher}}></LanguageSwitcher>
     </Suspense>
     <Navbar
        pages={pages}
        {...{darkMode}}
        {...{showLanguageSwitcher, setShowLanguageSwitcher}}
      />
     <Suspense fallback={<div />}>
        <Switch location={location}>
          {pages.map((page, index) => {
            return (
              <Route
                exact
                path={page.pageLink}
                render={({match}) => <page.view />}
                key={index}
              />
            );
          })}
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </div>
  )
   
}

export default withTranslation()(App)