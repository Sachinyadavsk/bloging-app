import { useState, useRef } from "react";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation.jsx";
import { Toaster, toast } from "react-hot-toast";
import dcript from "bcryptjs";
import axios from "axios";

const UserAuthForm = ({ type }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isSignIn = type === "sign-in";

    const AuthForm = useRef(null);

    // ✅ Correct axios call with right parameters
    const userAuthtoughServer = async (serverRoute, formData) => {
        try {
            const res = await axios.post(
                import.meta.env.VITE_SERVER_URL + serverRoute,
                formData
            );
            console.log(res.data);
            toast.success("Authentication successful!");
        } catch (err) {
            console.error("Error during authentication:", err);
            toast.error("Authentication failed");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const serverRoute = isSignIn ? "/login" : "/signup";

        if (!AuthForm.current) {
            return toast.error("Form not found");
        }

        const form = new FormData(AuthForm.current);
        const formdata = Object.fromEntries(form.entries());

        const fullname = formdata.name;
        const email = formdata.email;
        const password = formdata.password;

        // 🔹 Fullname validation (only for signup)
        if (!isSignIn) {
            if (!fullname || fullname.length < 3) {
                return toast.error("Full name must be at least 3 characters long");
            }
        }

        // 🔹 Password validation
        if (!password || password.length < 6) {
            return toast.error("Password must be at least 6 characters long");
        }

        // 🔹 Email validation
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!email || !emailRegex.test(email)) {
            return toast.error("Invalid email format");
        }

        try {
            // 🔹 FIXED — Await bcrypt hashing
            const hashedPassword = await dcript.hash(password, 10);

            const finalData = {
                fullname: fullname || null,
                email,
                password: hashedPassword,
            };

            // 🔹 FIXED — correct order of params
            await userAuthtoughServer(serverRoute, finalData);

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex justify-center items-center p-4">
                <Toaster />
                <form
                    ref={AuthForm}
                    onSubmit={handleSubmit}
                    className="w-[80%] max-w-[400px] bg-white p-6 rounded-2xl shadow-md"
                >
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-10">
                        {isSignIn ? "Welcome back" : "Join us today"}
                    </h1>

                    {/* Full Name (Signup only) */}
                    {!isSignIn && (
                        <label className="block mb-6">
                            <span className="font-medium">Full Name</span>
                            <input
                                type="text"
                                name="name"
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
                            required
                            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring"
                            placeholder="Enter your email"
                        />
                    </label>

                    {/* Password */}
                    <label className="block mb-4 relative">
                        <span className="font-medium">Password</span>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            required
                            className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring"
                            placeholder="Enter your password"
                        />
                        <i
                            className={`absolute right-3 top-[35px] cursor-pointer 
                                ${showPassword ? "fi fi-rr-eye" : "fi fi-rr-eye-crossed"}`}
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </label>

                    {/* Submit */}
                    <button type="submit" className="btn-dark center mt-14">
                        {isSignIn ? "Sign In" : "Sign Up"}
                    </button>

                    {/* Divider (Sign-in only) */}
                    {isSignIn && (
                        <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                            <hr className="w-1/2 border-black" />
                            <p>or</p>
                            <hr className="w-1/2 border-black" />
                        </div>
                    )}

                    {/* Google Sign-in */}
                    {isSignIn && (
                        <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
                            <img src={googleIcon} alt="Google" className="w-5" />
                            Sign in with Google
                        </button>
                    )}

                    {/* Bottom Links */}
                    {isSignIn ? (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Don’t have an account?
                            <Link to="/signup" className="underline text-black text-xl ml-1">
                                Join us today
                            </Link>
                        </p>
                    ) : (
                        <p className="mt-6 text-dark-grey text-xl text-center">
                            Already a member?
                            <Link to="/signin" className="underline text-black text-xl ml-1">
                                Sign in here
                            </Link>
                        </p>
                    )}
                </form>
            </section>
        </AnimationWrapper>
    );
};

export default UserAuthForm;
