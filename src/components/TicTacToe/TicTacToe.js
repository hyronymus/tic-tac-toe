import React from "react";
import './TicTacToe.scss';
import {cloneDeep} from 'lodash-es';
import sean from '../../static/images/sean-O.jpg'

const isWinnerCell = (row,col,totals) => {
    return Math.abs(totals.row[row]) === 3 || Math.abs(totals.col[col]) === 3 || (row===col && Math.abs(totals.diag[0]) === 3) || (row+col===2 && Math.abs(totals.diag[1]) === 3)
}

const getPlayer = (turn) => {
    return turn % 2 === 0 ? 2 : 1
}

const defaultState = {
    turn: 1,
    cells: [[0,0,0],[0,0,0],[0,0,0]],
    totals: { row: [0,0,0], col: [0,0,0], diag: [0,0] },
    currentPlayer: 1,
    winner: null,
    isGameOver: false
}

export class TicTacToe extends React.Component {
    state = {
        ...cloneDeep(defaultState)
    }
    calculateTotals = (row, col, value) => {
        this.setState((state) => {
                const {totals, turn, currentPlayer} = state
                const newTotals = {...totals}
                const rowEqualsCol = row === col
                const rowColAddToTwo = row + col === 2

                newTotals.row[row] += value
                newTotals.col[col] += value

                if (rowEqualsCol) { newTotals.diag[0] += value }
                if (rowColAddToTwo) { newTotals.diag[1] += value }

                const winner = isWinnerCell(row, col, newTotals) ? currentPlayer : null
                const isGameOver = !!winner || turn >= 9

                const nextTurn = isGameOver ? turn : turn + 1
                const nextPlayer = isGameOver ? getPlayer(turn) : getPlayer(nextTurn)

                return {totals: newTotals, turn: nextTurn, currentPlayer: nextPlayer, winner, isGameOver}
            }, this.onStateChange
        )
    }
    onClickCell = (row, col) => {
            this.setState((state) => {
                const {cells, turn} = state
                const newCells = [...cells]
                newCells[row][col] =  getPlayer(turn) === 1 ? 1 : -1
                console.log(newCells)
                return {cells:newCells, /*cells:newCells,*/ }
            },() => this.calculateTotals(row,col, this.state.cells[row][col]))
    }
    onStateChange = () => { this.props.updateAppState(this.state) }
    resetGameBoard = () => this.setState({...cloneDeep(defaultState)})
    componentWillReceiveProps(newProps) {
        const {gameState} = newProps
        console.log('received props', gameState, this.state)
        if(gameState.turn === 1 && this.state.turn !== 1) {
            this.resetGameBoard()
        }
    }
    render(){
        const {cells, totals, winner} = this.state

        return (
            <div className='tic-tac-toe'>
                {cells.map( (cellRow, row)=> {
                    return(
                        <div key={`row-${row}`}>
                            {cellRow.map( (value, col)=> {
                                return (<Cell key={`cell-${row}-${col}`} winner={winner} highlight={isWinnerCell(row,col, totals)} value={value} row={row} col={col} onClick={this.onClickCell}/>)
                            })}
                        </div>
                    )

                })}
            </div>
        )
    }
}

const Cell = (props) => {
    const {winner, highlight, row, col, value, onClick} = props
    const displayValue = {'-1':'X','1':'O'}
    const maybeHighlight = highlight ? ' tic-tac-toe__cell--highlight' : ''
    const maybeHover = (!winner && !displayValue[value]) ? ' tic-tac-toe__cell--hover' : ''
    const gamePiece = (displayValue[value]) ? ' tic-tac-toe__cell--hover' : ''
    return (<div className={'tic-tac-toe__cell bg-md-dk' + maybeHighlight + maybeHover} onClick={() => !winner && !displayValue[value] && onClick(row,col, value)}><span>{displayValue[value] || ''}</span></div>
    )
}
