﻿import {ReactElement, ReactNode} from "react";
import "./StyleTable.css"

export type ElementToRender = ReactNode | ReactElement | string;
export type TableData = {
    headers: ElementToRender[];
    rows: ElementToRender[][];
    sizes?: number[];
}

function getCurrentWidth() {
    return window.innerWidth - 150;
}

function getPixelsDistribution(headers: string[]) {

    const currentWidth = getCurrentWidth();
    const totalChars = headers.reduce((acc, header) => acc + header.length, 0);

    return headers.map(header => {
        return header.length * (currentWidth / totalChars);
    });

}


function areValidSizes(sizes: number[] | undefined, expectedLength: number): boolean {
    if (!sizes) return false;
    if (sizes.length !== expectedLength) return false;
    return sizes.reduce((acc, size) => acc && size > 0, true);
}

function normalizeSizes(sizes: number[] | undefined): number[] {
    if (!sizes) return [];
    const count = sizes.reduce((acc, size) => acc + size, 0);
    const currentWidth = getCurrentWidth();
    return sizes.map(size => currentWidth * size / count);
}

export const TableComponent = (props: TableData) => {

    const headersWidth = areValidSizes(props.sizes, props.headers.length) ? normalizeSizes(props.sizes) : getPixelsDistribution(props.headers);
    const headers = props.headers;

    const headersDisplay = headers.map((header, index) => {
        return <span key={index} className={"style-table-header-cell style-table-cell"}
                     style={{width: (headersWidth[index]) + 'px'}}>{header}</span>
    });

    // ahora vamos a analizar las rows
    const rows = props.rows;
    const rowsDisplay = rows.map(row => {
        return row.map((element, index) => {
            return <span className={"style-table-cell"} key={index}
                         style={{width: (headersWidth[index]) + 'px'}}>{element}</span>
        });
    });


    return (
        <div className={"style-table-container"}>
            <div className={"style-table-header-container"}>
                {headersDisplay}
            </div>
            <div className={"style-table-body-container"}>
                {rowsDisplay.map((row, index) => {
                    return <div key={index} style={{display: 'flex', flexDirection: 'row'}}>
                        {row}
                    </div>
                })}
            </div>
        </div>
    )


};