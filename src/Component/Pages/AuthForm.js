import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

import classes from "./AuthForm.module.css";

import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../storee/AuthReducer";

export default function AuthForm() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const nameInputRef=useRef()
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const confirmPasswordInputRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    // const changedemail = enteredEmail.replace("@", "").replace(".", "");

    localStorage.setItem("email", enteredEmail);
    const name=nameInputRef.current.value;
    const email = emailInputRef.current.value;
    const password = confirmPasswordInputRef.current.value;
    // console.log(enteredName,enteredEmail, enteredPassword, confirmPassword);

    setIsLoading(true);
    if (!isLogin) {
      axios
        .post("http://localhost:3000/signup", { name, email, password })
        .then((response) => {
          console.log(response.data);
          const { token } = response.data;
          const {userId}=response.data
          console.log(token);
          console.log(userId)
          localStorage.setItem("userId", userId);
          localStorage.setItem("token", token);

          dispatch(authActions.islogin(token))
          navigate("/loggedin");
          // Store the token in local storage or cookies
          // Perform any necessary actions after successful signup
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
          // Handle signup error
        });
    } else {
      axios
        .post("http://localhost:3000/login", { email, password })
        .then((response) => {
          const { token } = response.data;

          const userId = response.data.userId; // Replace `response.data.userId` with the actual response data containing the user ID

          localStorage.setItem("userId", userId);
          localStorage.setItem("token", token);

          dispatch(authActions.islogin(token))
          navigate("/loggedin");
          // Store the token in local storage or cookies
          // Perform any necessary actions after successful login
        })
        .catch((error) => {
          console.error(error);
          // Handle login error
        });
    }

     
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(authActions.islogin(token));
    }
  }, []);

  return (
    <div>
      {!isLoggedIn && (
        <section className={classes.auth}>
          <h1>{isLogin ? "Login" : "Sign Up"}</h1>
          <form onSubmit={submitHandler}>
          <div className={classes.control}>
              <label htmlFor="name">Your Name</label>
              <input type="text" id="name" ref={nameInputRef} required />
            </div>
            <div className={classes.control}>
              <label htmlFor="email">Your Email</label>
              <input type="email" id="email" ref={emailInputRef} required />
            </div>
            <div className={classes.control}>
              <label htmlFor="password">Your Password</label>
              <input
                type="password"
                id="password"
                ref={passwordInputRef}
                required
              />
            </div>
            <div className={classes.control}>
              <label htmlFor="confirmpassword">Confirm Password</label>
              <input
                type="password"
                id="confirmpassword"
                ref={confirmPasswordInputRef}
                required
              />
            </div>

            <div className={classes.actions}>
              {!isLoading && (
                <button>{isLogin ? "Login" : "Create Account"}</button>
              )}
              {isLoading && <p>Sending Request... </p>}
              <button
                type="button"
                className={classes.toggle}
                onClick={switchAuthModeHandler}
              >
                {isLogin ? "Create new account" : "Login with existing account"}
              </button>
            </div>
            <div className={classes.actions}>
              <button className={classes.forgot}>Forgot Password</button>
            </div>
          </form>
        </section>
      )}
      {isLoggedIn && (
        <h2 className={classes.loggedInmessage}>
          You Are already logged in, Visit Product section to see our Products
        </h2>
      )}
    </div>
  );
}
