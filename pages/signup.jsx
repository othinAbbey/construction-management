import React, { useState } from 'react';

// import {useState} from 'react';

function SignUpPage() {
    
    try {
        

        // const [signupWithEmail, setSignupWithEmail] = useState(false);
        // const [signupWithPhone, setSignupWithPhone] = useState(false);
        // const [creatingAccount, setCreatingAccount] = useState(false);
        const [signupWithEmail, setSignupWithEmail] = useState(false);
        const [signupWithPhone, setSignupWithPhone] = useState(false);
        const [creatingAccount, setCreatingAccount] = useState(false);
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [email, setEmail] = useState('');
        const [phone, setPhone] = useState('');
        const [password, setPassword] = useState('');
        const [region, setRegion] = useState('');
        const [accountType, setAccountType] = useState('');

        const handleSignup = () => {
            if (signupWithEmail) {
                // Handle signup with email (use state for email and password)
            } else if (signupWithPhone) {
                // Handle signup with phone (use state for phone and password)
            }
        };

        const handleCreateAccount = async () => {
            // Handle account creation (use state for first name, last name, email, phone, region, and account type)
            // e.preventDefault();
            try {
                const   response = await fetch('http://localhost:8000/user/signup', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phone,
                    password,
                    region,
                    accountType,
                  }),
                });
          
                const data = await response.json();
          
                // Handle the response from the backend (e.g., show a success message, redirect, etc.)
                console.log(data);
              } catch (error) {
                console.error('Error creating account:', error);
              } finally {
                setCreatingAccount(false);
              }
            };
          
         

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
                    <h2 className="text-2xl text-center mb-4">Welcome to Construction Manager</h2>
                    {/* <div className="mb-4 flex">
          <button
            className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded ${
              signupWithEmail ? "bg-blue-600" : "bg-blue-500"
            }`}
            onClick={() => {
              setSignupWithEmail(true);
              setSignupWithPhone(false);
            }}
          >
            Signup With Email Address
          </button>
          <button
            className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded ${
              signupWithPhone ? "bg-blue-600" : "bg-blue-500"
            }`}
            onClick={() => {
              setSignupWithPhone(true);
              setSignupWithEmail(false);
            }}
          >
            Signup With Phone Number
          </button> */}
                    <div className="mb-4 flex">
                        <button
                            className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2 ${
                                signupWithEmail ? "bg-blue-600" : "bg-blue-500"
                            }`}
                            onClick={() => {
                                setSignupWithEmail(true);
                                setSignupWithPhone(false);
                            }}
                        >
                            Signup With Email Address
                        </button>
                        <button
                            className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded ${
                                signupWithPhone ? "bg-blue-600" : "bg-blue-500"     
                            }`}
                            onClick={() => {
                                setSignupWithPhone(true);
                                setSignupWithEmail(false);
                            }}
                        >
                            Signup With Phone Number
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    {signupWithEmail && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Email
                            </label>
                            <input
                                type="text"
                                value={email}
                            onChange={(e) => setEmail(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    )}
                    {signupWithPhone && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Phone Number
                            </label>
                            <input
                                type="number"
                                value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>
                    {/* <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Region
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option>Northwest</option>
                            <option>Northeast</option>
                            <option>Southwest</option>
                            <option>Southeast</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Account Type
                        </label>
                        <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option>Individual</option>
                            <option>Company</option>
                        </select>
                    </div> */}
                    <button
                        className={`w-full bg-green-500 text-white font-bold py-2 px-4 rounded mt-4 ${
                            creatingAccount ? "bg-green-600" : "bg-green-500"
                        }`}
                        onClick={handleCreateAccount}
                    >
                        Create Account
                    </button>
                    {/* <button
            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleSignup}
            >
            Signup
            </button> */}
                    </div>
                </div>
            );
        }
        catch (error) {
            console.log(error);
        }
    }

export default SignUpPage;



