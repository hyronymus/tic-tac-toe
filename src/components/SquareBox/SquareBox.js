import * as React from 'react'
import './SquareBox.scss'

export const SquareBox = (props) => {
    return (
        <div className="square-box">
            <div className="square-box__content">
                {props.children}
            </div>
        </div>
    )
}