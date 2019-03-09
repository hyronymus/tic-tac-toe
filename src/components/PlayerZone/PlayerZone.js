import React from "react";
import './PlayerZone.scss'

export const PlayerZone = (props) => {
    const {playerInfo} = props
    return (
        <div className="player-zone bg-md-lt">
            <div className="player-zone__section">
                <h5>WINS:</h5>
                <p>{playerInfo.wins}</p>
                <h5>LOSSES:</h5>
                <p>{playerInfo.losses}</p>
            </div>
            <hr/>
        </div>
    )
}