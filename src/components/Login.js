import "./Login.css";
import React, { useRef, useState } from "react";
import DailyExpenses from "./DailyExpenses"

const Login = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Toggle form view
  const [message, setMessage] = useState("");
  const [isLoggedIn,setIsLoggedIn]=useState(false)

  // Submit handler for login
  const submitHandler = (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA-c6Dg8OhFXdKPptqWnwwSvJDl6Nv8btc",
      {
        method: "POST",
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        setIsLoading(false);
        if (response.ok) {
          return response.json();
        } else {
          return response.json().then((data) => {
            const errorMessage =
              data.error?.message || "Authentication failed!";
            alert(errorMessage);
            throw new Error(errorMessage);
          });
        }
      })
      .then((data) => {
        localStorage.setItem("token", data.idToken);
        localStorage.setItem("userEmailId", data.email);
        setIsLoggedIn(true)
        alert("Login successful!");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Submit handler for forgot password
  const forgotPasswordHandler = (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;

    if (!enteredEmail) {
      alert("Please enter your email.");
      return;
    }

    setIsLoading(true);

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyA-c6Dg8OhFXdKPptqWnwwSvJDl6Nv8btc",
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "PASSWORD_RESET",
          email: enteredEmail,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        setIsLoading(false);
        if (response.ok) {
          setMessage("Password reset email sent. Check your inbox!");
          return response.json();
        } else {
          return response.json().then((data) => {
            alert(data.error?.message || "Failed to send reset email.");
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
        alert("An error occurred. Please try again.");
      });
  };
  if (isLoggedIn) {
    return <DailyExpenses />
  }

  return (
    <div>
      <form onSubmit={isForgotPassword ? forgotPasswordHandler : submitHandler}>
        <h2>{isForgotPassword ? "Forgot Password" : "Login"}</h2>
        <div className="form-container">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" ref={emailInputRef} required />

          {!isForgotPassword && (
            <>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                ref={passwordInputRef}
                minLength="6"
                required
              />
            </>
          )}

          <button type="submit" disabled={isLoading}>
            {isLoading
              ? isForgotPassword
                ? "Sending..."
                : "Logging in..."
              : isForgotPassword
              ? "Send Reset Email"
              : "Login"}
          </button>
          {isForgotPassword ? (
            <button
              type="button"
              onClick={() => setIsForgotPassword(false)}
            >
              Back to Login
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
            >
              Forgot Password
            </button>
          )}
        </div>
        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
