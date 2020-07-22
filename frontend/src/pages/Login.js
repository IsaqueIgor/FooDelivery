import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//Material UI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import LinkUI from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CircularProgress from '@material-ui/core/CircularProgress';

import Logo from '../assets/logo.png';
import Svg from '../assets/svg/login.svg';

//custom-hook
import useForm from '../hooks/forms';
import { loginAction } from '../redux/actions/authActions';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      {'Copyright © '}
      <LinkUI
        color='inherit'
        target='_blank'
        href='https://www.linkedin.com/in/isaqueigor/'
      >
        Isaque Igor
      </LinkUI>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  svg: {
    display: 'flex',
    justifyItems: 'flex-start',
    position: 'absolute',
  },
  logo: {
    margin: theme.spacing(8),
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  buttonsubmit: {
    borderRadius: 16,
    height: 46,
    background: theme.palette.primary.main,
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function Login() {
  const classes = useStyles();

  const { loading, serverError, errors, signUpSuccess } = useSelector(
    (state) => state.UI
  );
  const dispatch = useDispatch();
  const history = useHistory();

  const loginHandle = (props) => {
    const userData = {
      email: inputs.email,
      password: inputs.password,
    };
    dispatch(loginAction(userData, history));
  };

  const { inputs, handleInputChange, handleSubmit } = useForm(
    {
      email: '',
      password: '',
    },
    loginHandle
  );

  let incorrectCredentialsError = null;
  let verifyEmailError = null;
  if (errors) {
    if (errors.includes('Invalid email/password'))
      incorrectCredentialsError = errors;
    if (errors.includes('Verify your email')) verifyEmailError = errors;
  }

  return (
    <>
      {' '}
      <div className={classes.container}>
        <div className={classes.svg}>
          <img src={Svg} />
        </div>
        <Container maxWidth='xs'>
          <CssBaseline />
          <div className={classes.paper}>
            <div className={classes.logo}>
              <img src={Logo} />
            </div>
            <form className={classes.form} noValidate onSubmit={handleSubmit}>
              {signUpSuccess && (
                <Typography variant='body2' className={classes.customSuccess}>
                  Account registered successfully, please verify your Email
                  before logging-in
                </Typography>
              )}
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
                onChange={handleInputChange}
                value={inputs.email}
              />
              <TextField
                variant='outlined'
                margin='normal'
                required
                fullWidth
                name='password'
                className={classes.textField}
                onChange={handleInputChange}
                value={inputs.password}
                label='Password'
                type='password'
                id='password'
                autoComplete='current-password'
              />
              {serverError && (
                <Typography variant='body2' className={classes.customError}>
                  {'server error, please try again'}
                </Typography>
              )}
              {verifyEmailError && (
                <Typography variant='body2' className={classes.customError}>
                  {verifyEmailError}
                </Typography>
              )}

              {incorrectCredentialsError && (
                <Typography variant='body2' className={classes.customError}>
                  {incorrectCredentialsError}
                </Typography>
              )}
              <Button
                type='submit'
                fullWidth
                disabled={loading}
                variant='contained'
                color='primary'
                className={classes.buttonsubmit}
              >
                Login
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
                  <Link to='/register' variant='body2'>
                    {"Don't have an account? Sign Up "}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>

          <Box mt={8}>
            <Copyright />
          </Box>
        </Container>
      </div>
    </>
  );
}
