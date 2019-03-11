import React from "react";
import './Avatar.scss'

export const Avatar = (props) => {
    const {name} = props
    return (
        <div className="avatar">
            <div className="avatar__circle">
                <i className="avatar__icon fas fa-user"></i>
                <div className="avatar__name">{name}</div>
            </div>
        </div>
    )
}