import React from 'react'
import "./UpdateProfilePage.css"
import { useContext, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { AuthContext } from './auth-context'

const UpdateProfilePage = () => {
  const authCtx = useContext(AuthContext);
  const history = useHistory();

  const [userData, setUserData] = useState({ displayName: '', photoUrl: '' });

  // Fetch user profile data when the token changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyA-c6Dg8OhFXdKPptqWnwwSvJDl6Nv8btc`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              idToken: authCtx.token,
            }),
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        const userProfile = data.users[0];

        setUserData({
          displayName: userProfile.displayName || '',
          photoUrl: userProfile.photoUrl || '',
        });
      } catch (error) {
        console.error(error);
        alert('Failed to fetch user profile data.');
      }
    };

    if (authCtx.token) {
      fetchUserProfile(); // Only fetch data when token is available
    }
  }, [authCtx.token]); // Run this effect only when `authCtx.token` changes

  const handleSubmit = async (event) => {
    event.preventDefault();
    const enteredFullname = userData.displayName;
    const enteredUrl = userData.photoUrl;

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
        throw new Error(errorData.error.message || 'Failed to update profile!');
      }

      const data = await response.json();
      console.log('Profile updated successfully:', data);
      history.push('/');
    } catch (error) {
      console.error('Error updating profile:', error.message);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <>
      <div className='profile-container'>
        <div>Winners never quit, Quitters never win</div>
        <div>
          Your Profile is 64% completed. A complete Profile has higher chances
          of landing a Job. Complete now
        </div>
      </div>
      <h2>Contact Details</h2>
      {userData.displayName && userData.photoUrl ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="fullname">Full Name:</label>
          <input
            type='text'
            id="fullname"
            name='displayName'
            value={userData.displayName}
            onChange={handleInputChange}
            required
          />
          <label htmlFor='photourl'>Profile Photo URL</label>
          <input
            type='url'
            id="photourl"
            name="photoUrl"
            value={userData.photoUrl}
            onChange={handleInputChange}
            required
          />
          <button type='submit'>Update</button>
        </form>
      ) : (
        <p>Loading...</p> 
      )}
      <button type='button' onClick={() => history.push('/')}>Cancel</button>
    </>
  );
};

export default UpdateProfilePage;
