import { useGlobalContext } from "../context/store";

const Score: React.FC<{}> = () => {

    const { score } = useGlobalContext();

    return <div className="score">
        <h3>SCORE: {score}</h3>
    </div>
}

export default Score;