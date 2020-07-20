import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

//jwt-decode
import jwtDecode from 'jwt-decode';

//API
import api from './util/api';

//redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { SET_AUTHENTICATED } from './redux/types';
import { logoutAction, getUserData } from './redux/actions/authActions';

//material-ui
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

//components
import AppBar from './components/AppBar';
import Footer from './components/Footer';

//theme
import themeFile from './util/theme';

const theme = createMuiTheme(themeFile);

const token = localStorage.jwt;

if (token) {
  const decodedToken = jwtDecode(token);
  // console.log(decodedToken);
  if (decodedToken.exp * 1000 < Date.now()) {
    store.dispatch(logoutAction());
    window.location.href = '/login';
  } else {
    store.dispatch({ type: SET_AUTHENTICATED });
    api.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <AppBar />
          <Footer />
        </Router>
      </Provider>
    </MuiThemeProvider>
  );
}

export default App;
