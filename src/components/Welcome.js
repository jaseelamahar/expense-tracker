import React from 'react';
import "./Welcome.css";
import { useHistory } from 'react-router-dom'

const WelcomeScreen = () => {
  const history=useHistory()
  const handleCompletenow=()=>{
    history.push('/updateprofile')

  }
  return (
    <div className='welcome-container'>
      <div >Welcome to Expense Tracker</div>
      <div >Your profile is Incomplete.
        <button type='button' onClick={handleCompletenow}>Complete now</button> </div>
    </div>
  );
};

export default WelcomeScreen;
