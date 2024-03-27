'use client';

import { createContext, useContext, Dispatch, SetStateAction, useState, ReactNode, useRef, RefObject } from "react";
import { CrosswordData } from "../components/CustomExports";
import { Socket } from "socket.io-client";

interface ContextProps {
    score: number,
    answered: CrosswordData,
    crossword: CrosswordData,
    disabled: boolean,
    signedIn: boolean,
    userName: string,
    roomid: string,
    socket?: Socket,
    oppName: string,
    oppSid: string,
    isHost: boolean,
    setIsHost: Dispatch<SetStateAction<boolean>>,
    setOppSid: Dispatch<SetStateAction<string>>,
    setOppName: Dispatch<SetStateAction<string>>,
    setSocket: Dispatch<SetStateAction<Socket | undefined>>,
    setRoomId: Dispatch<SetStateAction<string>>,
    setUserName: Dispatch<SetStateAction<string>>,
    setSignedIn: Dispatch<SetStateAction<boolean>>,
    setScore: Dispatch<SetStateAction<number>>,
    setAnswered: Dispatch<SetStateAction<CrosswordData>>,
    setCrossword: Dispatch<SetStateAction<CrosswordData>>,
    setDisabled: Dispatch<SetStateAction<boolean>>,
}

const GlobalContext = createContext<ContextProps>({
    score: 0,
    answered: {
        across: {},
        down: {},
    },
    disabled: false,
    crossword: {
        across: {},
        down: {},
    },
    isHost: false,
    signedIn: false,
    userName: "",
    roomid: "",
    oppName: "",
    oppSid: "",
    setIsHost: () => false,
    setOppSid: () => "",
    setOppName: () => "",
    setSocket: () => {},
    setRoomId: () => "",
    setUserName: () => "",
    setSignedIn: () => {},
    setScore: (): number => 0,
    setAnswered: () => {},
    setCrossword: () => {},
    setDisabled: () => {},
})

export const GlobalContextProvider = ({ children }: { children: ReactNode }) => {
    const [score,setScore] = useState(0);
    const [answered, setAnswered] = useState<CrosswordData>({across: {},down: {}});
    const [crossword, setCrossword] = useState<CrosswordData>({across: {},down : {}});
    const [disabled, setDisabled] = useState<boolean>(false);
    const [signedIn, setSignedIn] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>("Bosh");
    const [roomid, setRoomId] = useState<string>("")
    const [socket, setSocket] = useState<Socket>();
    const [oppName, setOppName] = useState<string>("");
    const [oppSid, setOppSid] = useState<string>("");
    const [isHost, setIsHost] = useState<boolean>(false);

    return <GlobalContext.Provider value={{score, answered, disabled, crossword, signedIn, userName, roomid, socket,oppName, isHost, oppSid, setIsHost, setOppSid, setOppName, setSocket, setRoomId, setUserName, setSignedIn, setScore, setAnswered, setCrossword, setDisabled}}>
        {children}
    </GlobalContext.Provider>
}

export const useGlobalContext = () => useContext(GlobalContext);