import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import Auth from '../hoc/auth';

import Loading from './view/LoadingComponent/Loading';
import NavBar from './view/NavBar/NavBar';
import LandingPage from './view/LandingPage/LandingPage';
import SignUpPage from './view/SignUpPage/SignUpPage';
import SignInPage from './view/SignInPage/SignInPage';
import RecipePage from './view/RecipePage/RecipePage';
import UploadRecipePage from './view/RecipePage/UploadRecipePage';
import RecipeDetailPage from './view/RecipePage/RecipeDetailPage';
import FooterSection from './view/Footer/FooterSection';

function App() {
  return (
    <Suspense fallback={(<Loading />)}>
        <NavBar />
        <div className="contentContainer">
            <Switch>
                <Route exact path="/" component={Auth(LandingPage, null)} />
                <Route exact path="/signup" component={Auth(SignUpPage, false)} />
                <Route exact path="/signin" component={Auth(SignInPage, false)} />
                <Route exact path="/recipe" component={Auth(RecipePage, null)} />
                <Route exact path="/recipe/upload" component={Auth(UploadRecipePage, true)} />
                <Route exact path="/recipe/:recipeId" component={Auth(RecipeDetailPage, null)} />
            </Switch>
        </div>
        <FooterSection />
    </Suspense>
  );
}

export default App;
