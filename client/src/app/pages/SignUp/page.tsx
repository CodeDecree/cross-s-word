"use client"
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignUp: React.FC<{}> = () => {

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [RPassword, setRPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const createUser = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            if(password.length < 8) throw({ message: "Password must be atleast 8 characters", response: null });
            if(password !== RPassword) throw({ message: "Password does not match", response: null });
            const response = await axios.post(`https://crossword-server.onrender.com/${process.env.API_KEY}/signUp`, {
                userid: name,
                password: password,
            });
            router.replace('/pages/SignIn')
        } catch (error: any) {
            console.error('There was a problem with your Axios request:', error);
            if(error.response != null) setErrorMessage(error.response.data.message);
            else {
                setErrorMessage(error.message)
            }
        }
    }

    return <>
        <div className="container">
            <form className="form-box" onSubmit={createUser}>
                <FontAwesomeIcon icon={faUserAlt} style={{ height: '6rem', width: 'auto', marginBottom: '4rem' }} />
                <input type="text" placeholder="Username" className="form-element" onChange={(e) => setName(e.target.value)} value={name} />
                <input type="password" placeholder="Password" className="form-element" onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirm Password" className="form-element" onChange={(e) => setRPassword(e.target.value)} />
                <span style={{color: "red"}}>{errorMessage}</span>
                <button className="btn form-element" type="submit">SIGN UP</button>
            </form>
        </div>
    </>
}

export default SignUp;