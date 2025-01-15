import React, { useState, useRef } from 'react';
import './SignUp.css';

const SignUp = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const [isSignin, setIsSignin] = useState(false);

  const submitHandler = (event) => {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // Sign-up request
    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDXR_hL2qdUhRdZzUOsGxoW_gIEn3o90h0',
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            const errorMessage =
              data.error?.message || ' failed!';
            alert(errorMessage);
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        console.log('User has successfully signed up', data);
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <form onSubmit={submitHandler}>
      <h2>Sign Up</h2>
      <div className="form-container">
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required ref={emailInputRef} />

        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" required ref={passwordInputRef} />

        <label htmlFor="confirm-password">Confirm Password:</label>
        <input type="password" id="confirm-password" name="confirm-password" required />

        <button type="submit">Sign Up</button>
      </div>
      <div className="account">
        Have an account?<button type="button">Login</button>
      </div>
    </form>
  );
};

export default SignUp;
