import { useState } from "react";

function LoginPage() {
  try {
    const [loginWithEmail, setLoginWithEmail] = useState(false);
    const [loginWithPhone, setLoginWithPhone] = useState(false);
    const [creatingAccount, setCreatingAccount] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    //signup constants
    const [signupWithEmail, setSignupWithEmail] = useState(false);
    const [signupWithPhone, setSignupWithPhone] = useState(false);
    // const [creatingAccount, setCreatingAccount] = useState(false);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    // const [email, setEmail] = useState('');
    const [phone, setPhone] = useState("");
    // const [password, setPassword] = useState('');
    const [region, setRegion] = useState("");
    const [accountType, setAccountType] = useState("");
    const handleLogin = async () => {
      if (!email || !password) {
        alert("Email and password are required.");
        // You might want to show an error message to the user
        // For example: setError("Email and password are required.");
        return;
      }
      if (loginWithEmail) {
        const response = await fetch("https://canda.onrender.com/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        // const data = await response.json();
        // console.log(data);
        if (!response.ok) {
          const errorData = await response.json();
          alert(errorData.message || "Something went wrong.");
          return;

          // Handle login with email (use state for email and password)
        }
        const data = await response.json();
        console.log("Login successful:", data);
        // Handle successful login (e.g., redirect to dashboard)
        //redirect to dashboard
        window.location.href = "/GetStarted";
      }
    };

    const handleCreateAccount = async () => {
      const response = await fetch("https://canda.onrender.com/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
      try {
        const data = await response.json();
        // Handle the response from the backend (e.g., show a success message, redirect, etc.)
        console.log(data);
        if (response.ok) {
          alert("Account created successfully; please login to continue.");
        } else {
          if (data.missingFields && data.missingFields.length > 0) {
            alert(`Missing fields: ${data.missingFields.join(", ")}`);
          } else {
            alert(data.message || "Something went wrong.");
          }
        }
      } catch (error) {
        console.error("Error creating account:", error);
      } finally {
        setCreatingAccount(false);
      }
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
          <h2 className="text-2xl text-center mb-4">
            Welcome to Construction Manager
          </h2>
          <h3>
            Login with your email and password or create an account to get started
          </h3>
          <div className="mb-4 flex">
            {/* <button
              className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2 ${
                loginWithEmail ? "bg-blue-600" : "bg-blue-500"
              }`}
              onClick={() => {
                setLoginWithEmail(true);
                handleLogin();
                // setLoginWithPhone(false);
              }}
            >
              Login
            </button> */}
            {/* <button
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
          </div>
          {loginWithEmail && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border rounded py-2 px-3"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded py-2 px-3 mt-2"
              />

              <button className="text-blue-500 mt-2">Forgot Password</button>
            </div>
          )}
          <button
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={() => {
              if (loginWithEmail) {
                handleLogin();
              } else {
                setLoginWithEmail(true);
              }
              // handleLogin();
              // setLoginWithEmail(true)
            }}
          >
            Login
          </button>
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
            {creatingAccount && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border rounded py-2 px-3"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border rounded py-2 px-3 mt-2"
                />
                {/* <select className="w-full border rounded py-2 px-3 mt-2">
                <option value="individual">Individual</option>
                <option value="company">Company</option>
              </select> */}
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border rounded py-2 px-3 mt-2"
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded py-2 px-3 mt-2"
                />
                {/* <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border rounded py-2 px-3 mt-2"
              /> */}
                <input
                  type="text"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border rounded py-2 px-3 mt-2"
                />
                {/* <button
                className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={handleCreateAccount}
              >
                Submit
              </button> */}
              </div>
            )}

            <div className="flex items-center justify-center text-sm text-gray-600">
              {!creatingAccount ? (
                <h6>OR </h6>
              ) : (
                <h6>Thanks for choosing to join us</h6>
              )}
            </div>
            <button
              className={`w-full bg-green-500 text-white font-bold py-2 px-4 rounded mt-4 ${
                creatingAccount ? "bg-green-600" : "bg-blue-500"
              }`}
              onClick={() => {
                if (creatingAccount) {
                  handleCreateAccount();
                } else {
                  setCreatingAccount(true);
                }
              }}
            >
              {creatingAccount ? "Submit" : "Sign Up"}
            </button>

            {/* <button
            className={`w-full bg-green-500 text-white font-bold py-2 px-4 rounded mt-4 ${
              creatingAccount ? "bg-green-600" : "bg-green-500"
            }`}
            onClick={() => {setCreatingAccount(true)}}
          >
            Create an Account
          </button> */}
          </div>
        </div>
      </div>
    );
  } catch {
    console.log(error);
  }
}

// function SignUpPage() {

//   try {

//       // const [signupWithEmail, setSignupWithEmail] = useState(false);
//       // const [signupWithPhone, setSignupWithPhone] = useState(false);
//       // const [creatingAccount, setCreatingAccount] = useState(false);

//       const handleSignup = () => {
//           if (signupWithEmail) {
//               // Handle signup with email (use state for email and password)
//           } else if (signupWithPhone) {
//               // Handle signup with phone (use state for phone and password)
//           }
//       };

//       const handleCreateAccount = async () => {
//           // Handle account creation (use state for first name, last name, email, phone, region, and account type)
//           // e.preventDefault();
//           try {

//               const   response = await fetch('http://localhost:8000/user/signup', {

//                 method: 'POST',
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                   firstName,
//                   lastName,
//                   email,
//                   phone,
//                   password,
//                   region,
//                   accountType,
//                 }),
//               });

//               const data = await response.json();

//               // Handle the response from the backend (e.g., show a success message, redirect, etc.)
//               console.log(data);
//             } catch (error) {
//               console.error('Error creating account:', error);
//             } finally {
//               setCreatingAccount(false);
//             }
//           };

//       return (
//           <div className="min-h-screen flex items-center justify-center bg-gray-100">
//               <div className="w-full max-w-md p-6 bg-white rounded shadow-md">
//                   <h2 className="text-2xl text-center mb-4">Welcome to Construction Manager</h2>
//                   {/* <div className="mb-4 flex">
//         <button
//           className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded ${
//             signupWithEmail ? "bg-blue-600" : "bg-blue-500"
//           }`}
//           onClick={() => {
//             setSignupWithEmail(true);
//             setSignupWithPhone(false);
//           }}
//         >
//           Signup With Email Address
//         </button>
//         <button
//           className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded ${
//             signupWithPhone ? "bg-blue-600" : "bg-blue-500"
//           }`}
//           onClick={() => {
//             setSignupWithPhone(true);
//             setSignupWithEmail(false);
//           }}
//         >
//           Signup With Phone Number
//         </button> */}
//                   <div className="mb-4 flex">
//                       <button
//                           className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2 ${
//                               signupWithEmail ? "bg-blue-600" : "bg-blue-500"
//                           }`}
//                           onClick={() => {
//                               setSignupWithEmail(true);
//                               setSignupWithPhone(false);
//                           }}
//                       >
//                           Signup With Email Address
//                       </button>
//                       <button
//                           className={`flex-1 bg-blue-500 text-white font-bold py-2 px-4 rounded ${
//                               signupWithPhone ? "bg-blue-600" : "bg-blue-500"
//                           }`}
//                           onClick={() => {
//                               setSignupWithPhone(true);
//                               setSignupWithEmail(false);
//                           }}
//                       >
//                           Signup With Phone Number
//                       </button>
//                   </div>
//                   <div className="mb-4">
//                       <label className="block text-gray-700 text-sm font-bold mb-2">
//                           First Name
//                       </label>
//                       <input
//                           type="text"
//                           value={firstName}
//                           onChange={(e) => setFirstName(e.target.value)}
//                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       />
//                   </div>
//                   <div className="mb-4">
//                       <label className="block text-gray-700 text-sm font-bold mb-2">
//                           Last Name
//                       </label>
//                       <input
//                           type="text"
//                           value={lastName}
//                           onChange={(e) => setLastName(e.target.value)}
//                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       />
//                   </div>
//                   {signupWithEmail && (
//                       <div className="mb-4">
//                           <label className="block text-gray-700 text-sm font-bold mb-2">
//                               Email
//                           </label>
//                           <input
//                               type="text"
//                               value={email}
//                           onChange={(e) => setEmail(e.target.value)}
//                               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                           />
//                       </div>
//                   )}
//                   {signupWithPhone && (
//                       <div className="mb-4">
//                           <label className="block text-gray-700 text-sm font-bold mb-2">
//                               Phone Number
//                           </label>
//                           <input
//                               type="number"
//                               value={phone}
//                           onChange={(e) => setPhone(e.target.value)}
//                               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                           />
//                       </div>
//                   )}
//                   <div className="mb-4">
//                       <label className="block text-gray-700 text-sm font-bold mb-2">
//                           Password
//                       </label>
//                       <input
//                           type="password"
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       />
//                   </div>
//                   {/* <div className="mb-4">
//                       <label className="block text-gray-700 text-sm font-bold mb-2">
//                           Region
//                       </label>
//                       <select
//                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       >
//                           <option>Northwest</option>
//                           <option>Northeast</option>
//                           <option>Southwest</option>
//                           <option>Southeast</option>
//                       </select>
//                   </div>
//                   <div className="mb-4">
//                       <label className="block text-gray-700 text-sm font-bold mb-2">
//                           Account Type
//                       </label>
//                       <select
//                           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                       >
//                           <option>Individual</option>
//                           <option>Company</option>
//                       </select>
//                   </div> */}
//                   <button
//                       className={`w-full bg-green-500 text-white font-bold py-2 px-4 rounded mt-4 ${
//                           creatingAccount ? "bg-green-600" : "bg-green-500"
//                       }`}
//                       onClick={handleCreateAccount}
//                   >
//                       Create Account
//                   </button>
//                   {/* <button
//           className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded mt-4"
//           onClick={handleSignup}
//           >
//           Signup
//           </button> */}
//                   </div>
//               </div>
//           );
//       }
//       catch (error) {
//           console.log(error);
//       }
//   }

export default LoginPage;
