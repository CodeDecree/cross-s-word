import { useEffect, useState } from "react"
import { useGlobalContext } from "../context/store";

export default function Clock() {

    const [min,setMin] = useState(0);
    const [sec, setSec] = useState(0);
    const {disabled} = useGlobalContext();

    useEffect(() => {
        if(disabled) {
            return;
        }
        const clock = setInterval(() => {
            setSec(prevSec => ((prevSec + 1)%60));
        },1000);
        const clockMin = setInterval(() => {
            setMin(prevMin => (prevMin + 1));
        },1000*60);

        return () => {
            clearInterval(clock);
            clearInterval(clockMin);
        }
    },[disabled]);

    return <>
    <div className="clock ctr">
        <div className="watch">
            <div className="hand"></div>
        </div>
        <h2>{min < 10 ? `0${min}` : min}:{sec < 10 ? `0${sec}` : sec}</h2>
    </div>
    </>
}