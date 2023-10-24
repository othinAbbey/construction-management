import { useState } from "react";

function LoginPage() {
  const [loginWithEmail, setLoginWithEmail] = useState(false);
  const [loginWithPhone, setLoginWithPhone] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);

  const handleLogin = () => {
    if (loginWithEmail) {
      // Handle login with email (use state for email and password)
    } else if (loginWithPhone) {
      // Handle login with phone (use state for phone and password)
    }
  };

  const handleCreateAccount = () => {
    // Handle account creation (use state for first name, last name, email, phone, region, and account type)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl text-center mb-4">Welcome to Construction Manager</h2>
        {/* <div className="mb-4 flex">
          <button
            className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded ${
              loginWithEmail ? "bg-blue-600" : "bg-blue-500"
            }`}
            onClick={() => {
              setLoginWithEmail(true);
              setLoginWithPhone(false);
            }}
          >
            Login With Email Address
          </button>
          <button
            className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded ${
              loginWithPhone ? "bg-blue-600" : "bg-blue-500"
            }`}
            onClick={() => {
              setLoginWithPhone(true);
              setLoginWithEmail(false);
            }}
          >
            Login With Phone Number
          </button> */}

<div className="mb-4 flex">
  <button
    className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2 ${
      loginWithEmail ? "bg-blue-600" : "bg-blue-500"
    }`}
    onClick={() => {
      setLoginWithEmail(true);
      setLoginWithPhone(false);
    }}
  >
    Login With Email Address
  </button>
  <button
    className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded ${
      loginWithPhone ? "bg-blue-600" : "bg-blue-500"
    }`}
    onClick={() => {
      setLoginWithPhone(true);
      setLoginWithEmail(false);
    }}
  >
    Login With Phone Number
  </button>


        </div>
        {loginWithEmail && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Email"
              className="w-full border rounded py-2 px-3"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded py-2 px-3 mt-2"
            />
            <button
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleLogin}
            >
              Login
            </button>
            <button className="text-blue-500 mt-2">Forgot Password</button>
          </div>
        )}
        {loginWithPhone && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Phone"
              className="w-full border rounded py-2 px-3"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded py-2 px-3 mt-2"
            />
            <button
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={handleLogin}
            >
              Login
            </button>
            <button className="text-blue-500 mt-2">Forgot Password</button>
          </div>
        )}
        <div className="mb-4">
            <h4>New to Site Simplify?</h4>
          <button
            className={`w-full bg-green-500 text-white font-bold py-2 px-4 rounded mt-4 ${
              creatingAccount ? "bg-green-600" : "bg-green-500"
            }`}
            onClick={() => setCreatingAccount(true)}
          >
            Create an Account
          </button>
          {creatingAccount && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="First Name"
                className="w-full border rounded py-2 px-3"
              />
              <input
                type="text"
                placeholder="Last Name"
                className="w-full border rounded py-2 px-3 mt-2"
              />
              <select className="w-full border rounded py-2 px-3 mt-2">
                <option value="individual">Individual</option>
                <option value="company">Company</option>
              </select>
              <input
                type="text"
                placeholder="Email"
                className="w-full border rounded py-2 px-3 mt-2"
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full border rounded py-2 px-3 mt-2"
              />
              <input
                type="text"
                placeholder="Region"
                className="w-full border rounded py-2 px-3 mt-2"
              />
              <button
                className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleCreateAccount}
              >
                Create Account
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
