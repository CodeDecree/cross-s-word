"use client"
import { usePathname, useRouter } from "next/navigation";
import { useGlobalContext } from "../context/store";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import axios from "axios";
import { useEffect } from "react";

export default function Navbar() {

    const { signedIn, userName, setUserName, setSignedIn } = useGlobalContext();
    const router = useRouter();
    const pathname = usePathname();
    
    useEffect(() => {
        const checkAuthentication = async () => {
          try {
            if(pathname === '/pages/PlayArea') return <></>;
            const response = await axios.get(`https://crossword-server.onrender.com/${process.env.API_KEY}/validate-token`, { withCredentials: true });
            setUserName(response.data.user.username);
            setSignedIn(true);
          } catch (error) {
            setSignedIn(false);
            setUserName("Bosh");
          } 
        };
        checkAuthentication();
      }, [])

    const logout = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log('hello')
        const res = await axios.get('http://localhost:8080/api/logout', { withCredentials: true });
        console.log(res)
        setSignedIn(false)
        router.push('/');
    }

    return (

        <>
            <div className="Navbar">
                <div className="Navbar-left">
                    <img src="../crossword-icon.svg" alt="" />
                    <button style={{ color: 'white' }} className="btn" onClick={() => router.replace('/')}>cross-s-words</button>
                </div>
                <div className="Navbar-right">
                    <button style={{ color: 'white' }} className="btn">SUPPORT</button>
                    <h3>|</h3>
                    {signedIn ?
                        (
                            <>
                                {/* <button style={{ color: 'white' }} className="btn" onClick={() => setVisibility(!visibility)}>{userName.toUpperCase()}</button> */}
                                <form onSubmit={logout}>
                                <Menu>
                                    <MenuButton as={Button}
                                        transition='all 0.2s'
                                        fontSize='1.12rem'
                                        cursor="pointer"
                                        color="white"
                                        background="black"
                                        border="none"
                                        outline="none"
                                        _focus={{ boxShadow: 'outline' }}
                                        fontFamily='Poppins'>
                                        {userName.toUpperCase()}
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem
                                        fontSize="2 rem"
                                        fontFamily="Poppins"
                                        outline="none"
                                        type="submit">LogOut</MenuItem>
                                    </MenuList>
                                </Menu>
                                </form>
                            </>
                        ) :
                        <>
                            <button style={{ color: 'white' }} className="btn" onClick={() => router.push('/pages/SignIn')}>SIGN IN</button>
                            <button style={{ color: 'white' }} className="btn" onClick={() => router.push('/pages/SignUp')}>SIGN UP</button>
                        </>
                    }
                </div>
            </div>
        </>
    );
}