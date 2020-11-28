import React, { Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';

import Auth from '../hoc/auth';

import Loading from './views/LoadingComponent/Loading';
import NavBar from './views/NavBar/NavBar';
import LandingPage from './views/LandingPage/LandingPage';
import SignUpPage from './views/SignUpPage/SignUpPage';
import SignInPage from './views/SignInPage/SignInPage';
import RecipePage from './views/RecipePage/RecipePage';
import UploadRecipePage from './views/RecipePage/UploadRecipePage';
import RecipeDetailPage from './views/RecipePage/RecipeDetailPage';
import FooterSection from './views/Footer/FooterSection';

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
