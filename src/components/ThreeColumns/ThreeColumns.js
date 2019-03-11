import React from "react";
import './ThreeColumns.scss'

export const ThreeColumns = (props) => {
    const {left, center, right, justifyContent, className, style} = props
    const justifyColClass = !!justifyContent ? 'justify-content-'+justifyContent : ''
    return (
        <div className={'three-columns '+className} style={style || {}}>
            <div className={"column column--left mobile-hide " + justifyColClass}>
                {left}
            </div>
            <div className={"column column--center " + justifyColClass}>
                {center}
            </div>
            <div className={"column column--right mobile-hide " + justifyColClass}>
                {right}
            </div>
        </div>
    )
}