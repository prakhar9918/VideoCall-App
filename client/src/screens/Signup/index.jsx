import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const navigate = useNavigate(); 

    const handleSubmit = (event) => {   
        event.preventDefault(); 
        const userData = {
            username,
            email,
            password
        };  
         
        fetch('https://videocall-app-575a.onrender.com/api/users/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies in the request,
            body: JSON.stringify(userData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
     navigate('/login'); 
    }
  return (
    <div>   
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="username">Username:</label> 
                <input type="text" id="username" name="username" onChange={(e) => setUsername(e.target.value)} required/>
            </div>
            <div>   
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" onChange={(e) => setPassword(e.target.value)} required />        
            </div>
            <button type="submit">Sign Up</button>
            </form>
    </div>
  );
}


export default SignUp;
