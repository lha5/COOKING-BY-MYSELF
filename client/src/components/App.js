import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css'

import Auth from '../hoc/auth';
import NavBar from './view/NavBar/NavBar';
import LandingPage from './view/LandingPage/LandingPage';
import UploadProductPage from './view/UploadProductPage/UploadProductPage';
import Footer from './view/Footer/Footer';

function App() {
  return (
    <Suspense fallback={(<div>LOADING...</div>)}>
        <NavBar />
        <Switch>
            <Route exact path="/" component={Auth(LandingPage, null)} />
            {/*<Route exact path="/user/signin" component={Auth(SigninPage, false)} />*/}
            <Route exact path="/product/upload" component={Auth(UploadProductPage, true)} />
        </Switch>
        <Footer />
    </Suspense>
  );
}

export default App;
