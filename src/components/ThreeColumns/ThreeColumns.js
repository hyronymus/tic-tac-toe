import React from "react";
import './ThreeColumns.scss'

export const ThreeColumns = (props) => {
    const {left, center, right, stretch} = props
    return (
        <div className="three-columns">
            <div className={"column column--left"}>
                {left}
            </div>
            <div className={"column column--center"}>
                {center}
            </div>
            <div className={"column column--right"}>
                {right}
            </div>
        </div>

    )
}