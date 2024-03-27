"use client"
import { useGlobalContext } from "@/app/context/store";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignIn: React.FC<{}> = () => {

    const router = useRouter();
    const { setSignedIn, setUserName } = useGlobalContext();
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const logInUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`https://crossword-server.onrender.com/${process.env.API_KEY}/signIn`, {
                userid: name,
                password: password,
            }, {
                withCredentials: true,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                }
            });

            setUserName(response.data.user);
            setSignedIn(true);
            router.replace('/')
        } catch (error: any) {
            if(error.response != undefined && error.response.data != undefined) setErrorMessage(error.response.data.message);
            else setErrorMessage("Some Error Occured!")
        }
    }

    return <>
        <div className="container">
            <form className="form-box" onSubmit={logInUser}>
                <FontAwesomeIcon icon={faUserAlt} style={{ height: '6rem', width: 'auto', marginBottom: '4rem' }} />
                <input type="text" placeholder="Username" className="form-element" onChange={(e) => setName(e.target.value)} value={name} />
                <input type="password" placeholder="Password" className="form-element" onChange={(e) => setPassword(e.target.value)} value={password} />
                <span style={{color: "red"}}>{errorMessage}</span>
                <button className="btn form-element" type="submit">SIGN IN</button>
            </form>
        </div>
    </>
}

export default SignIn;