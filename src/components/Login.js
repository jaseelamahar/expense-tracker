import "./Login.css"
import React, { useRef, useState } from "react";
import { useHistory } from "react-router-dom";

const Login = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const history= useHistory();

  const submitHandler = (e) => {
    e.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setIsLoading(true);

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDXR_hL2qdUhRdZzUOsGxoW_gIEn3o90h0",
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
        history.replace("/welcome"); // Redirect to the dummy screen
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div >
      <form onSubmit={submitHandler}>
        <h2>Login</h2>
      
        < div className="form-container">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" ref={emailInputRef} required />
  
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            ref={passwordInputRef}
            minLength="6"
            required
          />
        
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <button>Forgot Password</button>
        </div>
        <div className="account">
          Don't have an account?<button>SignUp</button>
        </div>
      </form>
    </div>
  );
};

export default Login;
