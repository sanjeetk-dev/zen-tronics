import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Handle Google login logic here (frontend only)
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f5f0ff]">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold text-[#333333] mb-4">Welcome Back</h2>
        <p className="text-[#333333] mb-6">Sign in to continue</p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center bg-[#ff8e44] hover:bg-[#ff7b30] text-white font-bold py-3 rounded-lg shadow-md transition"
        >
          <FcGoogle className="w-6 h-6 mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
