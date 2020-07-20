import React from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

//material-ui
import makeStyles from '@material-ui/core/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  ...theme.spreadThis,
  title: {
    margin: '10px 0px 10px 0px',
  },
  hamBurger: {
    height: 200,
    width: 240,
  },
}));

export default function Login() {
  const classes = useStyles();

  const { loading, serverError, errors, signUpSuccess } = useSelector(
    (state) => state.UI
  );
  const dispatch = useDispatch();
  const history = useHistory();

  let incorrectCredentialsError = null;
  let verifyEmailError = null;
  if (errors) {
    if (errors.includes('Invalid email/password'))
      incorrectCredentialsError = errors;
    if (errors.includes('Verify your email')) verifyEmailError = errors;
  }

  return (
    <Grid container className={classes.form}>
      <Grid item sm />
      <Grid item sm style={{ marginBottom: 34 }}>
        <Typography variant='h3' className={classes.title}>
          Login
        </Typography>
      </Grid>
    </Grid>
  );
}
