import React from 'react'
import "./UpdateProfilePage.css"
import { useRef ,useContext} from 'react'
import {useHistory} from 'react-router-dom'
import {AuthContext} from './auth-context'


const UpdateProfilePage = () => {
  const authCtx = useContext(AuthContext);
  console.log(authCtx.token);
  const history=useHistory();

    const fullnameInputRef=useRef();
    const urlInputRef=useRef();

    const handleSubmit=async(event)=>{
        event.preventDefault();
        const enteredFullname=fullnameInputRef.current.value;
        const enteredUrl=urlInputRef.current.value;
        console.log( enteredFullname,enteredUrl,authCtx.token)
        const idToken = authCtx.token; // Make sure the token is being correctly passed from context
        if (!idToken) {
          alert("User not authenticated!");
          return;
        }

        try {
            const response = await fetch(
              'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyA-c6Dg8OhFXdKPptqWnwwSvJDl6Nv8btc',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  idToken: authCtx.token,
                  displayName: enteredFullname,
                  photoUrl: enteredUrl,
                  returnSecureToken: true,
                }),
              }
            );
      
            if (!response.ok) {
              const errorData = await response.json();
      console.error('Error Response:', errorData);
      throw new Error(errorData.error.message || 'Failed to update profile!');;
            }
      
            const data = await response.json();
            console.log('Profile updated successfully:', data);
           history.push('/');
          } catch (error) {
            console.error('Error updating profile:', error.message);
            alert('Failed to update profile. Please try again.');
          }
        };

    
  return (
    <>
    <div className='profile-container'>
    <div>Winners never quit,Quitters never win</div> 
    <div>Your Profile is 64% completed.A complete Profile has higher chances of landing a Job.Complete now</div>
     </div> 
     <h2>Contact Details</h2>
      <form  onSubmit={handleSubmit}>
        <label htmlFor="fullname" >Full Name:</label>
        <input type='text' id="fullname" name='fullname' ref={fullnameInputRef} required/>
        <label htmlFor='photourl'>Profile Photo URL</label>
        <input type='url' id="photourl" name="photourl" ref={urlInputRef} required/>
        <button type='submit'>Update</button>
      </form>
      <button type='button' onClick={() => history.push('/')}>Cancel</button>
    </>
  )
}

export default UpdateProfilePage
