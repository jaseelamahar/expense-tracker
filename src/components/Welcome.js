import React from 'react';
import "./Welcome.css";
import { useHistory } from 'react-router-dom'
import { AuthContext } from "./auth-context";
import { useContext } from 'react';

const WelcomeScreen = () => {
  
  const { logout } = useContext(AuthContext);
  const history=useHistory()

  const logoutHandler = () => {
    logout();
    history.replace("/login"); // Redirect to login screen
  };
  
  const handleCompletenow=()=>{
    history.push('/updateprofile')
  }
const sendVerificationEmailHandler = () => {
    const idToken = localStorage.getItem("token");

    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyA-c6Dg8OhFXdKPptqWnwwSvJDl6Nv8btc",
      {
        method: "POST",
        body: JSON.stringify({
          requestType: "VERIFY_EMAIL",
          idToken,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          alert(
            "Verification email sent successfully! Check your email to verify."
          );
        } else {
          return response.json().then((data) => {
            const errorMessage =
              data.error?.message || "Failed to send verification email!";
            alert(errorMessage);
            throw new Error(errorMessage);
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
    
  }
  return (
    <>
    <div className='welcome-container'>
      <div >Welcome to Expense Tracker</div>
      <div >Your profile is Incomplete.
        <button type='button' onClick={handleCompletenow}>Complete now</button> </div>
        <button onClick={logoutHandler}>LogOut</button>

    </div>
    <button onClick={sendVerificationEmailHandler}>Verify Email ID</button>
      <p>
        Check your email; you might have received a verification link. Click on
        it to verify.
      </p>
    </>
  );
};

export default WelcomeScreen;
