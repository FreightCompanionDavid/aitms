import React, { useState, useEffect } from 'react';
import './LudicrousMode.js';

const LudicrousMode = ({ children }) => {
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const handleKeyPress = (e) => {
            if (e.key === 'L' && e.ctrlKey && e.shiftKey) {
                setIsActive(!isActive);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isActive]);

    return (
        <div className={`ludicrous-mode ${isActive ? 'active' : ''}`}>
            {children}
            {isActive && <div className="ludicrous-overlay"></div>}
        </div>
    );
};

export default LudicrousMode;
