import { useState } from "react";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router-dom";

const UserAuthForm = ({ type }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isSignIn = type === "sign-in";
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isSignIn && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log("Form Submitted:", formData);
    };

    return (
        <section className="h-cover flex justify-center items-center p-4">
            <form
                onSubmit={handleSubmit}
                className="w-[80%] max-w-[400px] bg-white p-6 rounded-2xl shadow-md"
            >
                <h1 className="text-4xl font-gelasio capitalize text-center mb-10">
                    {isSignIn ? "Welcome back" : "Join us today"}
                </h1>

                {/* Full Name - Only for SIGN UP */}
                {!isSignIn && (
                    <label className="block mb-6">
                        <span className="font-medium">Full Name</span>
                        <input
                            type="text"
                            name="name"
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring"
                            placeholder="Enter your full name"
                        />
                    </label>
                )}

                {/* Email */}
                <label className="block mb-4">
                    <span className="font-medium">Email</span>
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring"
                        placeholder="Enter your email"
                    />
                </label>

                {/* Password */}
                {/* Password */}
                <label className="block mb-4 relative">
                    <span className="font-medium">Password</span>

                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        onChange={handleChange}
                        required
                        className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring"
                        placeholder="Enter your password"
                    />

                    {/* Toggle Icon */}
                    <i
                        className={`absolute right-3 top-[35px] cursor-pointer 
                    ${showPassword ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed"}`}
                        onClick={() => setShowPassword(!showPassword)}
                    ></i>
                </label>

                {/* Button */}
                <button
                    type="submit"
                    className="btn-dark center mt-14"
                >
                    {isSignIn ? "Sign In" : "Sign Up"}
                </button>
                {isSignIn && (
                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black" />
                        <p>or</p>
                        <hr className="w-1/2 border-black" />

                    </div>
                )}
                {isSignIn && (
                    <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center" >
                        <img src={googleIcon} alt="" className="w-5" />
                        Sign in with Google
                    </button>
                )}
                {isSignIn ?
                    <p className="mt-6 text-dark-grey text-xl text-center">
                        Don`t have an account?
                        <Link to="/signup" className="underline text-black text-xl ml-1">Join us today</Link>
                    </p>
                    : <p className="mt-6 text-dark-grey text-xl text-center">
                        Already a member?
                        <Link to="/signin" className="underline text-black text-xl ml-1">Sign in here</Link>
                    </p>
                }

            </form>
        </section>
    );
};

export default UserAuthForm;
