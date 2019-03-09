import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import {ThreeColumns} from "./components/ThreeColumns/ThreeColumns";
import {Avatar} from "./components/Avatar/Avatar";
import {Logo} from "./components/Logo/Logo";
import {PlayerZone} from "./components/PlayerZone/PlayerZone";
import {GameStage} from "./components/GameStage/GameStage";
import Modal from "react-bootstrap/es/Modal";
import Button from "react-bootstrap/es/Button";
import cloneDeep from "lodash-es/cloneDeep";
import ButtonGroup from "react-bootstrap/es/ButtonGroup";
import DropdownButton from "react-bootstrap/es/DropdownButton";
import Dropdown from "react-bootstrap/es/Dropdown";

const stages = ['pre', 'during', 'post']
const themes = ['Default', 'Zardoz']

/*
* need stageIndex to tell which messages to show,
* -which player to highlight
* -reset button to trigger new game.
* -could add points and winnings in the sidebars.
*
* todo:
* 1. Add Banner messages
*   -Start
*   -Winner or Cat's Game
* 2. Add Restart Button
* 3. Add Refresh Button (clear stat data)
* 3. Highlight active player
* 4. Display Game Stats
* 5. Make Responsive.
* 6. Add Swappable Game Pieces.
*
* */

const TOTAL_PLAYERS = 2

const newGameState = {
    currentStage: stages[0],
    currentPlayer: 1,
    turn: 1,
    winner: null,
}

const defaultState = {
    ...newGameState,
    theme: themes[0],
    stats: {
        totalGames: 0,
        players: [
            {
                name: null,
                points: 0,
                moves: [],
                wins: 0,
                losses: 0,
            },
            {
                name: null,
                points: 0,
                moves: [],
                wins: 0,
                losses: 0,
            }
        ]
    }
}

class App extends Component {
    state = {
        ...defaultState
    }

    resetGame = () => { this.setState(defaultState) }
    startNewGame = () => { this.setState(newGameState) }
    setPlayerNames = (names) => {
        const {stats} = this.state
        const statsUpdate = cloneDeep(stats)
        names.forEach((name,index) => {
            statsUpdate.players[index].name = name
        })

        this.setState({stats: statsUpdate})
    }
    setTheme = (theme) => {
        this.setState({theme})
    }
    updateAppState =(gameState) => {
        const {turn, currentPlayer, winner, isGameOver} = gameState

        let currentStage
        if(turn === 0) {currentStage = stages[0]}
        else if(!isGameOver) {currentStage = stages[1]}
        else {currentStage = stages[2]}

        this.setState((state) => {
            const {stats} = state
            const statsCopy = {...stats}
            if(winner){
                /*TODO: add score algorithm, pass in score multiplier*/
                const loser = winner === 1 ? 2 : 1
                statsCopy.totalGames ++
                statsCopy.players[winner - 1].wins ++
                statsCopy.players[loser - 1].losses ++
            }
            return {turn, currentStage, winner, currentPlayer, stats: statsCopy}
        })
    }
    render() {
    const {stats,theme} = this.state
    const themeClass = 'theme-'+theme.toLowerCase()
    return (
      <div className={`App bg-md ${themeClass}`}>
        <header className="bg-dk">
            <nav className="navbar fixed-top" style={{zIndex: '1000'}}>
                <ButtonGroup>
                    <Button><span className="fa fa-refresh"></span>Undo</Button>
                    <DropdownButton as={ButtonGroup} title="Themes" id="bg-nested-dropdown">
                        {themes.map(theme => (<Dropdown.Item onClick={() => this.setTheme(theme)} eventKey={theme}>{theme}</Dropdown.Item>))}
                    </DropdownButton>
                </ButtonGroup>;
            </nav>
          <ThreeColumns left={<Avatar name={stats.players[0].name}/>} center={<Logo />} right={<Avatar name={stats.players[1].name}/>} />
        </header>
        <div className="body bg-md-lt">
          <ThreeColumns left={<PlayerZone playerInfo={stats.players[0]}/>} center={<GameStage updateAppState={this.updateAppState} gameState={this.state} startNewGame={this.startNewGame}/>} right={<PlayerZone playerInfo={stats.players[1]}/>}/>
        </div>
        <footer className="bg-md-dk">
            <ul>
                <li>Legal</li>
                <li>Mumbo</li>
                <li>Jumbo</li>
                <li>2019 &copy;</li>
            </ul>
        </footer>
        <NamesForm setPlayerNames={this.setPlayerNames} gameState={this.state} />
      </div>
    );
    }
}


class NamesForm extends React.Component {
    state = {
        names : [],
        nameInputValue : ''

    }
    onClickOk = () => {
        const {names, nameInputValue} = this.state
        const namesUpdate = cloneDeep(names)
        namesUpdate.push(nameInputValue)
        this.setState({names: namesUpdate, nameInputValue : ''},() => {
            const {names} = this.state
            if(this.state.names.length === TOTAL_PLAYERS) {
                this.props.setPlayerNames(names)
            }
        })
    }
    setNameInput = (e) => {
        this.setState({nameInputValue : e.target.value})
    }
    componentWillReceiveProps(newProps) {
        if(!newProps.gameState.stats.players[0].name) {
            this.setState({names:[],nameInputValue:''})
        }
    }
    render() {
        return (
                <Modal show={this.state.names.length < TOTAL_PLAYERS} dialogClassName="names-form">
                    <Modal.Body>
                        <h3>Player {this.state.names.length + 1}, Enter your name!</h3>
                        <input type="text" className="form-control" maxLength="20" value={this.state.nameInputValue} onChange={this.setNameInput}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" disabled={this.state.nameInputValue === ''} onClick={this.onClickOk}>Ok</Button>
                    </Modal.Footer>
                </Modal>


        )
    }
}

export default App;
