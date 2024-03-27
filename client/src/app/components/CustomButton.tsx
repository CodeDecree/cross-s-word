import { useRouter } from "next/navigation";
import { createElement } from "react";
import { useGlobalContext } from "../context/store";

interface CustomButtonProps {
    Name: string[];
    URL: string;
}

let first: boolean = true;

function children(word: string): React.JSX.Element[] {

    let value: React.JSX.Element[] = [];

    if (first == true) {
        word.split('').forEach(ch => {
            value.push(<div className="crossword-box"><span>{ch}</span></div>);
        })
    } else {
        word.split('').forEach(ch => {
            value.push(<div className="crossword-box hide-top-border"><span className="">{ch}</span></div>);
        })
    }

    first = false;

    return value;
}

const CustomButton: React.FC<CustomButtonProps> = ({ Name, URL }) => {

    first = true;
    const router = useRouter();
    const {setSignedIn,setUserName} = useGlobalContext();

    const handleClick = () => {
        setSignedIn(true);
        router.replace(URL);
    }

    return (
        <>
            <button className="btn" onClick={handleClick}>
                {Name.map((word) => createElement(
                    `div`,
                    { className: 'crossword-container' },
                    children(word)
                ))}
            </button>
        </>
    );
}

export default CustomButton;