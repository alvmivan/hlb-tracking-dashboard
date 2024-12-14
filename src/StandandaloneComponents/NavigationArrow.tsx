import React from 'react';

interface NavigationArrowProps {
    color?: string;
}

export const NavigationArrow: React.FC<NavigationArrowProps> = ({ color = "#fafafa" }) => {
    const arrowContainer = {
        position: 'absolute' as const,
        right: '8px',
        top: '50%',
        transform: 'translateY(-50%)',
        width: '40px',
        height: '10px'
    }

    const commonArrowStyle = {
        position: 'absolute' as const,
        width: "16px",
        height: "4px",
        backgroundColor: color,
        transformOrigin: "right center",
        right: 0,
        top: "50%"
    }

    const arrowPart1 = {
        ...commonArrowStyle,
        transform: "translateY(2px) rotate(45deg)",
        borderRadius: "4px 10px 4px 4px",
    }
    
    const arrowPart2 = {
        ...commonArrowStyle,
        transform: "translateY(-1px) rotate(-45deg)",
        borderRadius: "4px 4px 10px 4px",        
    }

    return (
        <div style={arrowContainer}>
            <div style={arrowPart1} />
            <div style={arrowPart2} />
        </div>
    );
} 