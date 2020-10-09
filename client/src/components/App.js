import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css'

import LandingPage from './view/LandingPage/LandingPage';

function App() {
  return (
    <Router>
        <div>
            <Switch>
                <Route exact path="/" component={LandingPage} />
            </Switch>
        </div>
    </Router>
  );
}

export default App;
