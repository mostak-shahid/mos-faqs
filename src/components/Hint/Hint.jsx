import React from 'react'
import './Hint.scss'
export default function Hint({position='bottom', content}) {
    return (
        <span className={`hint-tooltip hint--${position}`} aria-label={content}>
            <i className="dashicons dashicons-editor-help"></i>
        </span>
    )
}
