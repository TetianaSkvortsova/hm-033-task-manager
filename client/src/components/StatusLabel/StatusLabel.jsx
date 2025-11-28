import React from 'react';
import './StatusLabel.css';
import {STATUS } from "../../common/status.js";

export default function StatusLabel({ status }) {

    return (
        <span className={`TaskStatus TaskStatus--${status}`}>
            {STATUS[status]}
        </span>
    );
}