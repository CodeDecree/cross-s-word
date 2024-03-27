import { useGlobalContext } from "../context/store";
import { CrosswordGrid, CrosswordProvider, CrosswordProviderImperative, DirectionClues } from "@jaredreisinger/react-crossword";
import { useRouter } from "next/navigation";
import Score from "./Score";
import { useEffect, useRef, useState } from "react";
import { replace } from "./CustomExports";
import Popup from "./PopUp";


const PlayBoard: React.FC<{}> = () => {

    const { crossword, answered, oppName, score, userName, isHost, setCrossword, oppSid, socket, disabled, setOppName, setOppSid, setAnswered, setScore, setDisabled } = useGlobalContext();
    const crosswordRef = useRef<CrosswordProviderImperative>(null);
    const [showAllAnswers, setshowAllAnswers] = useState(true);
    const userFilled = useRef<CrosswordProviderImperative>(null);
    const playRef = useRef<CrosswordProviderImperative>(null);
    const router = useRouter();
    const [showPop, setShowPop] = useState(false);

    const handleSubmit = () => {
        setDisabled(true);
    }

    const checkScore = (row: number, col: number, char: string) => {
        if (disabled) return;
        if (char.length === 0) char = " ";
        let temp = answered;
        for (let key in temp.across) {
            if ((temp.across[key].row === row) && temp.across[key].col <= col && temp.across[key].col + temp.across[key].answer.length > col) {
                temp.across[key].answer = replace(temp.across[key].answer, col - temp.across[key].col, char);
            }
        }
        for (let key in temp.down) {
            if ((temp.down[key].col === col) && temp.down[key].row <= row && temp.down[key].row + temp.down[key].answer.length > row) {
                temp.down[key].answer = replace(temp.down[key].answer, row - temp.down[key].row, char);
            }
        }
        setAnswered(temp);
        let sc = 0;
        for (let key in answered.across) {
            if (answered.across[key].answer === crossword.across[key].answer) sc++;
        }
        for (let key in answered.down) {
            if (answered.down[key].answer === crossword.down[key].answer) sc++;
        }
        setScore(sc);
        if (socket) {
            socket.emit('changed', { oppSid, answered, score });
        }
    }

    const toggleAnswers = () => {
        setshowAllAnswers(!showAllAnswers);
    }

    useEffect(() => {
        if (isHost && socket) {
            socket.emit('setDataOtherPlayer', { oppSid: oppSid, crossword, answered, oppName: userName });
        }
        if (socket) {
            socket?.on('listenChange', (answered) => {
                setScore(answered.score)
                setAnswered(answered.answered)
            });
            socket.on('playerLeft', () => setShowPop(true))
        }
    }, [])

    const disablePopUp = () => {
        setShowPop(false);
    }

    useEffect(() => {
        playRef.current?.fillAllAnswers();
    }, [answered])

    useEffect(() => {
        if (showAllAnswers) crosswordRef.current?.fillAllAnswers();
        else userFilled.current?.fillAllAnswers();
    }, [showAllAnswers])

    return <>
        <div className="board ctr">
            {showPop &&
                (
                    <>
                        <Popup message={`${oppName} has left.`} disable={disablePopUp} />
                    </>
                )
            }
            {disabled ?
                (showAllAnswers ?
                    (<CrosswordProvider data={crossword} ref={crosswordRef} onCellChange={checkScore}>
                        <DirectionClues direction="across" />
                        <DirectionClues direction="down" />
                        <div style={{ display: 'flex', gap: '3em' }}>
                            <div style={{ width: '30em', pointerEvents: disabled ? 'none' : 'auto' }}>
                                <CrosswordGrid />
                            </div>
                        </div>
                    </CrosswordProvider>)
                    :
                    (<CrosswordProvider data={answered} ref={userFilled} onCellChange={checkScore}>
                        <DirectionClues direction="across" />
                        <DirectionClues direction="down" />
                        <div style={{ display: 'flex', gap: '3em' }}>
                            <div style={{ width: '30em', pointerEvents: disabled ? 'none' : 'auto' }}>
                                <CrosswordGrid />
                            </div>
                        </div>
                    </CrosswordProvider>)
                )
                :
                (<CrosswordProvider data={answered} ref={playRef} onCellChange={checkScore}>
                    <DirectionClues direction="across" />
                    <DirectionClues direction="down" />
                    <div style={{ display: 'flex', gap: '3em' }}>
                        <div style={{ width: '30em', pointerEvents: disabled ? 'none' : 'auto' }}>
                            <CrosswordGrid />
                        </div>
                    </div>
                </CrosswordProvider>)

            }
        </div>
        <button className="exit btn" onClick={() => {
            socket?.disconnect();
            router.replace('/')
        }
        }
        >
            <img src="../alternate-sign-out.svg" />
        </button>
        <Score />
        {disabled ?
            (<button className="btn eye" onClick={toggleAnswers}>
                <img src="../eye.svg" alt="" />
            </button>) :
            <button className="submit btn" onClick={handleSubmit}>SUBMIT
            </button>
        }

    </>
}

export default PlayBoard;
