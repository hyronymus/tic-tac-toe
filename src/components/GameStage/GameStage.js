import React from "react";
import './GameStage.scss'
import {TicTacToe} from "../TicTacToe/TicTacToe";

const bannerText = (gameState) => {
    const {stats, currentPlayer, winner} = gameState
    const messages = {
        pre: {text: "Click on a square to begin!"},
        during: {text: `${stats.players[currentPlayer-1].name}, you're up!`},
        post: {text: winner ? `${stats.players[winner-1].name} wins!` : 'Cat\s Game :/'}
    }
    return messages[gameState.currentStage]
}

export const GameStage = (props) => {
    const {gameState, updateAppState, startNewGame} = props
    return (
        <div className="game-stage bg-md">
            <div className="game-stage__square">
                <div className="game-stage__banner">{bannerText(gameState).text} {gameState.currentStage === 'post' && <button onClick={startNewGame} className={'btn btn-primary'}><span className="fa fa-refresh"></span><span>New Game</span></button>}</div>
                <div className="game-stage__content bg-lt">
                    <TicTacToe gameState={gameState} updateAppState={updateAppState}/>
                </div>
            </div>

        </div>
    )
}

