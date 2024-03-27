"use client"
import { faHourglass3, faJoint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalContext } from "../../context/store";
import { Socket, io } from "socket.io-client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

const Lobby: React.FC<{}> = () => {

    const { roomid , crossword, answered, setIsHost, setRoomId, userName, setCrossword, setAnswered, setSocket, setOppSid, setOppName } = useGlobalContext();
    const socket = useRef<Socket>();
    const router = useRouter();

    useEffect(() => {
        const test = async () => {
            const res = await axios.get(`https://crossword-server.onrender.com/${process.env.API_KEY}/getBoard`);
            setCrossword(res.data.cw)
            setAnswered(res.data.temp)
        }

        test();
        
        setIsHost(true);
        const socket: Socket = io("https://crossword-server.onrender.com/", { transports: ['websocket'] });
        socket.emit('newGame', { userid: userName })
        socket.on('newGameCreated', (room: string) => {
            setRoomId(room.toUpperCase())
        })
        socket.on('setDataHost', (data) => {
            setOppSid(data.oppSid);
            setOppName(data.oppName);
            router.replace('/pages/PlayArea');
        })
        setSocket(socket);  
    }, [])

    const exitRoom = () => {
        socket.current?.disconnect();
    }

    return <>
        <div className="container">
            <div className="form-box">
                <FontAwesomeIcon icon={faHourglass3} style={{ height: '6rem', width: 'auto', marginBottom: '4rem' }} />
                <h3 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>ROOM ID  :  {roomid}</h3>
                <Link className="btn" href={{
                    pathname: '/'
                }}><button style={{width: '380px'}} className="btn form-element" onClick={exitRoom}>
                        EXIT
                    </button>
                </Link>
            </div>
        </div>
    </>
}

export default Lobby;