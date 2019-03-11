import React, {Component} from 'react';
import './App.scss';
import {ThreeColumns} from "./components/ThreeColumns/ThreeColumns";
import {Avatar} from "./components/Avatar/Avatar";
import {Logo} from "./components/Logo/Logo";
import {PlayerZone} from "./components/PlayerZone/PlayerZone";
import {GameStage} from "./components/GameStage/GameStage";
import Modal from "react-bootstrap/es/Modal";
import Button from "react-bootstrap/es/Button";
import cloneDeep from "lodash-es/cloneDeep";
import Dropdown from "react-bootstrap/es/Dropdown";
import Nav from "react-bootstrap/es/Nav";
import NavItem from "react-bootstrap/es/NavItem";
import NavLink from "react-bootstrap/es/NavLink";
import Navbar from "react-bootstrap/es/Navbar";
import {SquareBox} from "./components/SquareBox/SquareBox";

const stages = ['pre', 'during', 'post']
const themes = ['Default', 'Zardoz']
const TOTAL_PLAYERS = 2

const newGameState = {
    currentStage: stages[0],
    currentPlayer: 1,
    turn: 1,
    winner: null,
    prevState: null
}

const defaultState = {
    ...newGameState,
    undo: false,
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

    undo = () => {
        this.setState((state) => {
            const prevState = cloneDeep(state.prevState)
            return {...prevState, undo: true}
        })
    }

    startNewGame = () => {
        this.setState(newGameState)
    }

    setPlayerNames = (names) => {
        const {stats} = this.state
        const statsUpdate = cloneDeep(stats)
        names.forEach((name, index) => {
            statsUpdate.players[index].name = name
        })

        this.setState({stats: statsUpdate})
    }

    setTheme = (theme) => {
        this.setState({theme})
    }

    updateAppState = (gameState) => {
        const {turn, currentPlayer, winner, isGameOver} = gameState

        let currentStage
        if (turn === 0) {
            currentStage = stages[0]
        }
        else if (!isGameOver) {
            currentStage = stages[1]
        }
        else {
            currentStage = stages[2]
        }

        this.setState((state) => {
            const {stats} = state
            const statsCopy = {...stats}
            const prevState = cloneDeep(this.state)
            if (winner) {
                const loser = winner === 1 ? 2 : 1
                statsCopy.totalGames++
                statsCopy.players[winner - 1].wins++
                statsCopy.players[loser - 1].losses++
            }
            return {turn, currentStage, winner, currentPlayer, stats: statsCopy, prevState, undo: false}
        })
    }

    render() {

        const {stats, theme, undo, turn, winner} = this.state
        const themeClass = 'theme-' + theme.toLowerCase()
        return (
            <div className={`App bg-md ${themeClass}`}>
                <header className="bg-dk">
                    <Navbar className={'fixed-top'} collapseOnSelect expand="lg" bg="dark" variant="dark">
                        <Navbar.Brand>Tic Tac Toe</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav" className='justify-content-end'>
                            <Nav className='justify-content-end'>
                                <Nav.Item>
                                    <Nav.Link disabled={undo || turn === 1 || !!winner} onClick={this.undo}><span
                                        className="fa fa-refresh"></span>Undo</Nav.Link>
                                </Nav.Item>
                                <Dropdown as={NavItem}>
                                    <Dropdown.Toggle as={NavLink}>Themes</Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {themes.map(theme => <Dropdown.Item key={'theme-option-' + theme}
                                                                            onClick={() => this.setTheme(theme)}>{theme}</Dropdown.Item>)}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <ThreeColumns style={{marginTop: '56px'}} justifyContent="center" className={'mobile-hide'}
                                  left={<SquareBox><Avatar name={stats.players[0].name || 'Player 1'}/></SquareBox>} center={<Logo/>}
                                  right={<SquareBox><Avatar name={stats.players[1].name || 'Player 2'}/></SquareBox>}/>
                    <div className={'mobile-header'}>
                        <div>
                            <div style={{width: '75px', height: '75px', padding: '0 20px'}}>
                                <Avatar name={stats.players[0].name}/>
                            </div>
                            <div style={{fontSize: '2em', position: 'relative', top: '.15em'}}>VS.</div>
                            <div style={{width: '75px', height: '75px', padding: '0 20px'}}>
                                <Avatar name={stats.players[1].name}/>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="body bg-md-lt">
                    <ThreeColumns left={<PlayerZone playerInfo={stats.players[0]}/>}
                                  center={<GameStage updateAppState={this.updateAppState} gameState={this.state}
                                                     startNewGame={this.startNewGame}/>}
                                  right={<PlayerZone playerInfo={stats.players[1]}/>}/>
                </div>
                <footer className="bg-md-dk">
                    <ul>
                        <li>Legal</li>
                        <li>Mumbo</li>
                        <li>Jumbo</li>
                        <li>2019 &copy;</li>
                    </ul>
                </footer>
                <NamesForm setPlayerNames={this.setPlayerNames} gameState={this.state}/>
            </div>
        );
    }
}


class NamesForm extends React.Component {
    state = {
        names: [],
        nameInputValue: ''

    }

    onClickOk = () => {
        const {names, nameInputValue} = this.state
        const namesUpdate = cloneDeep(names)
        namesUpdate.push(nameInputValue)

        this.setState({names: namesUpdate, nameInputValue: ''}, () => {
            const {names} = this.state
            if (this.state.names.length === TOTAL_PLAYERS) {
                this.props.setPlayerNames(names)
            }
        })
    }

    setNameInput = (e) => {
        this.setState({nameInputValue: e.target.value})
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.gameState.stats.players[0].name) {
            this.setState({names: [], nameInputValue: ''})
        }
    }

    render() {
        return (
            <Modal show={this.state.names.length < TOTAL_PLAYERS} dialogClassName="names-form">
                <form onSubmit={this.onClickOk}>
                    <Modal.Body>
                        <h3>Player {this.state.names.length + 1}, Enter your name!</h3>
                        <input type="text" className="form-control" maxLength="20" value={this.state.nameInputValue}
                               onChange={this.setNameInput}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit" variant="primary" disabled={this.state.nameInputValue === ''}
                                onClick={this.onClickOk}>Ok</Button>
                    </Modal.Footer>
                </form>
            </Modal>
        )
    }
}

export default App;
