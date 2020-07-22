import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//material-ui
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Checkbox from '@material-ui/core/Checkbox';
import LinkUI from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Logo from '../assets/logo.png';

//custom-hook
import useForm from '../hooks/forms';

import { signupUser } from '../redux/actions/authActions';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <LinkUI color='inherit' href='https://github.com/IsaqueIgor'>
        Isaque Igor
      </LinkUI>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Register() {
  const classes = useStyles();

  const { loading, serverError, errors } = useSelector((state) => state.UI);
  const dispatch = useDispatch();
  const history = useHistory();

  const signupHandle = (props) => {
    const newUserData = {
      email: inputs.email,
      firstName: inputs.firstName,
      lastName: inputs.lastName,
      role: 'ROLE_USER',
      password: inputs.password,
      confirmPassword: inputs.confirmPassword,
    };
    dispatch(signupUser(newUserData, history));
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    signupHandle
  );

  // console.log(errors);
  let emailError = null;
  let passwordError = null;
  let confirmPasswordError = null;
  let firstNameEmptyError = null;
  let lastNameEmptyError = null;

  if (errors) {
    if (typeof errors !== 'string') {
      for (let i = 0; i < errors.length; i++) {
        if (errors[i].msg.includes('First Name'))
          firstNameEmptyError = errors[i].msg;
        if (errors[i].msg.includes('Last Name'))
          lastNameEmptyError = errors[i].msg;
        if (errors[i].msg.includes('valid email')) emailError = errors[i].msg;
        if (errors[i].msg.includes('Email address already'))
          emailError = errors[i].msg;
        if (errors[i].msg.includes('least 6 characters long'))
          passwordError = errors[i].msg;
        if (errors[i].msg.includes('Passwords have to'))
          confirmPasswordError = errors[i].msg;
      }
    }
  }

  return (
    <Grid container component='main' className={classes.root}>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <div className={classes.paper}>
            <div className={classes.logo}>
              <img src={Logo} />
            </div>
            <Typography component='h1' variant='h5'>
              Sign Up
            </Typography>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id='firstName'
                    name='firstName'
                    label='FirstName'
                    onChange={handleInputChange}
                    value={inputs.firstName}
                    className={classes.textField}
                    helperText={firstNameEmptyError}
                    error={firstNameEmptyError ? true : false}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id='lastName'
                    name='lastName'
                    label='LastName'
                    onChange={handleInputChange}
                    value={inputs.lastName}
                    className={classes.textField}
                    helperText={lastNameEmptyError}
                    error={lastNameEmptyError ? true : false}
                    required
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id='email'
                    name='email'
                    label='Email'
                    onChange={handleInputChange}
                    value={inputs.email}
                    className={classes.textField}
                    fullWidth
                    helperText={emailError}
                    error={emailError ? true : false}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id='password'
                    name='password'
                    type='password'
                    label='Password'
                    onChange={handleInputChange}
                    value={inputs.password}
                    className={classes.textField}
                    helperText={passwordError}
                    error={passwordError ? true : false}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id='confirmPassword'
                    name='confirmPassword'
                    type='password'
                    label='Confirm Password'
                    onChange={handleInputChange}
                    value={inputs.confirmPassword}
                    className={classes.textField}
                    helperText={
                      passwordError ? passwordError : confirmPasswordError
                    }
                    error={
                      passwordError ? true : confirmPasswordError ? true : false
                    }
                    fullWidth
                    required
                  />
                </Grid>
              </Grid>

              {serverError && (
                <Typography variant='body2' className={classes.customError}>
                  {'server error, please try again'}
                </Typography>
              )}

              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                className={classes.submit}
                disabled={loading}
              >
                Sign-up
                {loading && (
                  <CircularProgress size={30} className={classes.progress} />
                )}
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href='#' variant='body2'>
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link to='/' variant='body2'>
                    {"Don't have an account? Sign In"}
                  </Link>
                </Grid>
              </Grid>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </div>
      </Grid>
    </Grid>
  );
}
