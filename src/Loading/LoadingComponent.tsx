import {useEffect, useState} from "react";


type LoadingComponentProps = {
    pieceLength: number;
    pieceWidth: number;
    speed: number;
    color: { r: number, g: number, b: number };
    offset: { x: number, y: number };
    blendMode?: string;
}

const defaultConfig: LoadingComponentProps = {
    pieceLength: 30,
    pieceWidth: 6,
    speed: 1,
    color: {r: 255, g: 255, b: 255},
    offset: {x: 0, y: 0},
    blendMode: 'normal'
}

export const LoadingComponent = (props: Partial<LoadingComponentProps>) => {


    const config = {...defaultConfig, ...props};
    const {
        pieceLength,
        pieceWidth,
        speed,
        color,
        offset,
        blendMode
    }
        = config;

    const [angle, setAngle] = useState(0);

    useEffect(() => {

        const timeout = 5 / speed;

        const interval = setInterval(() => {
            setAngle(angle + 1);
        }, timeout);

        return () => clearInterval(interval);

    }, [angle, speed]);


    const parseAngle = (angle: number) => {
        //some string format that CSS can understand
        return angle;
    }


    const createSpanAt = (t: number, index: number) => {

        const currentAngle = angle + t * 360;

        const backgroundColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${t})`;

        const x = Math.cos(currentAngle * Math.PI / 180);
        const y = Math.sin(currentAngle * Math.PI / 180);

        const xPos = x * pieceLength + pieceLength * 2 + offset.x;
        const yPos = y * pieceLength + pieceLength * 2 + offset.y;

        const rotStyle = {
            transform: `rotate(${parseAngle(currentAngle)}deg)`,
            backgroundColor,
            width: `${pieceLength}px`,
            height: `${pieceWidth}px`,
            "border-radius": '4px',
            position: 'absolute',
            left: xPos + 'px',
            top: yPos + 'px',
            "blend-mode": blendMode
        }
        return <span key={index} style={rotStyle}> </span>
    }

    return (<div className={"loading-container"}>
        {Array.from({length: 12}, (_, i) => createSpanAt(i / 12, i))}
    </div>);
}