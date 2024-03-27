"use client"
import CustomButton from "./components/CustomButton";
import { useGlobalContext } from "./context/store";

export default function Home() {

  const { signedIn } = useGlobalContext();

  return <>
    <div className="ui-area">
      {
        signedIn ? 
        ( <>
          <CustomButton Name={["ENTER", "AROOM"]} URL='/pages/EnterLobby' />
          <CustomButton Name={["CREATE", "A ROOM"]} URL='/pages/Lobby' />
          </>
        ) : 
        (
          <CustomButton Name={["PLAYAS","GUE ST"]} URL='/pages/Lobby' />
        )
      }   
    </div>
  </>
}

// tasks:
// 1. user login with his profile to see the front page.
// 2. Match making.
// 3. custom room for a friend to join. create a passcode kind of shit.
// 4. establish a voice connection between the players.