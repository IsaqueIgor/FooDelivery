import {
  SIGNUP_SUCCESS,
  LOADING_UI,
  SET_ERRORS,
  SERVER_ERROR,
  CLEAR_ERRORS,
  LOADING_USER,
  SET_USER,
  SET_ERROR,
  SET_UNAUTHENTICATED,
  SET_ERRORS_SIGNUP_RESTAURANT,
} from '../types';

import api from '../../util/api';
import axiosNewInstance from 'axios';

export const signupUser = (newUserData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  api
    .post('/auth/signup-user', newUserData)
    .then((res) => {
      dispatch({
        type: SIGNUP_SUCCESS,
      });
      dispatch({ type: CLEAR_ERRORS });
      history.push('/login');
    })
    .catch((err) => {
      console.log(err.response.data);
      if (err.response) {
        dispatch({
          type: SET_ERRORS,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: SERVER_ERROR,
        });
      }
    });
};

export const loginAction = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  api
    .post('/auth/login', userData)
    .then((res) => {
      const jwt = `Bearer ${res.data.token}`;
      localStorage.setItem('jwt', jwt);
      api.defaults.headers.common['Authorization'] = jwt;
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      console.log('Authenticated, check localStorage', jwt);
      history.push('/');
    })
    .catch((err) => {
      if (err.response) {
        dispatch({
          type: SET_ERROR,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: SERVER_ERROR,
        });
      }
    });
};

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  api
    .get('/user')
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data.result,
      });
    })
    .catch((err) => console.log(err));
};

export const signupRestaurant = (newRestaurantData, history) => (dispatch) => {
  const location = `+${newRestaurantData.get('apt')},+${newRestaurantData.get(
    'locality'
  )},+${newRestaurantData.get('street')},+${newRestaurantData.get('cep')}`;
  axiosNewInstance
    .get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: location,
        key: process.env.REACT_APP_GOOGLE_API_KEY,
      },
    })
    .then((result) => {
      if (
        Array.isArray(result.data.results) &&
        result.data.results.length > 0
      ) {
        const formattedAddress = result.data.results[0].formatted_address;
        const latitude = result.data.results[0].geometry.location.lat;
        const longitude = result.data.results[0].geometry.location.lng;
        newRestaurantData.append('latitude', latitude);
        newRestaurantData.append('longitude', longitude);
        newRestaurantData.append('formattedAddress', formattedAddress);
      }

      dispatch(signupRestaurantFinal(newRestaurantData, history));
    })
    .catch((err) => {
      console.log(err);
    });
};

export const signupRestaurantFinal = (newRestaurantData, history) => (
  dispatch
) => {
  dispatch({ type: LOADING_UI });
  api
    .post('/auth/signup-restaurant', newRestaurantData)
    .then((res) => {
      dispatch({
        type: SIGNUP_SUCCESS,
      });
      dispatch({ type: CLEAR_ERRORS });
      history.push('/login');
    })
    .catch((err) => {
      if (err.response) {
        dispatch({
          type: SET_ERRORS_SIGNUP_RESTAURANT,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: SERVER_ERROR,
        });
      }
    });
};

export const logoutAction = (history) => (dispatch) => {
  localStorage.removeItem('jwt');
  delete api.defaults.headers.common['Authorization'];
  dispatch({ type: SET_UNAUTHENTICATED });
  if (history) history.push('/');
};
