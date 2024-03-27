"use client"
import Clock from '../../components/Clock';
import React from 'react';
import PlayBoard from '../../components/PlayBoard';
import { useGlobalContext } from '../../context/store';
const PlayArea: React.FC<{}> = () => {

    const { userName, oppName } = useGlobalContext();

    return <>
        <div className="ui-area">
            <div className="playarea">
                <h3 className="player1">{userName}
                    <button className="btn">
                        <img src="../mic.svg" alt="" />
                    </button>
                </h3>
                <Clock />
                <h3 className="player2">{oppName}
                    <button className="btn">
                        <img src="../volume-up.svg" alt="" />
                    </button>
                </h3>
                <PlayBoard />
            </div>
        </div>
    </>
};

export default PlayArea;
