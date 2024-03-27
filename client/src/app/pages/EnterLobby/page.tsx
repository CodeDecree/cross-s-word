"use client"
import { useGlobalContext } from "@/app/context/store";
import { faJoint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const Lobby: React.FC<{}> = () => {

    const { roomid, socket, setRoomId, userName, setOppSid, setSocket, setCrossword, setAnswered, setOppName } = useGlobalContext();
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        setRoomId("");
        const socket = io("https://crossword-server.onrender.com/", { transports: ['websocket'] });
        setSocket(socket);
    },[])

    const enterRoom = () => {
        try {
            if(socket === undefined) throw('socketError')
            socket.emit('joining', {userid: userName, room: roomid})
            socket.on('errorMessage', () => {
                setErrorMessage('No Room Found!');
            })
            socket.on('setDataPlayer2', (data: any) => {
                setErrorMessage("");
                setOppSid(data.oppSid);
                setCrossword(data.crossword);
                setAnswered(data.answered);
                setOppName(data.oppName);
                router.replace('/pages/PlayArea')
            })
        } catch (err) {
            console.error(err);
        }
    }

    return <>
        <div className="container">
            <div className="form-box">
                <FontAwesomeIcon icon={faJoint} style={{ height: '6rem', width: 'auto', marginBottom: '4rem' }} />
                <input type="text" placeholder="ROOM ID" className="form-element" onChange={(e) => setRoomId(e.target.value)} value={roomid} />
                <span style={{color: "red"}}>{errorMessage}</span>
                <button className="btn form-element" onClick={enterRoom}>ENTER</button>
            </div>
        </div>
    </>
}

export default Lobby;

