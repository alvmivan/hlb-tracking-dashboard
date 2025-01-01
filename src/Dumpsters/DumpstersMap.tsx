import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {Icon} from 'leaflet';
import {DumpsterData, GPSData} from "../lib/hlb-api-library/src/dumpsters/domain/dumpstersServices";
import {ReactElement, ReactNode, useEffect, useState} from "react";
import './Dumpsters.css';
import {just, Maybe, nothing} from "../lib/hlb-api-library/src/maybeMonad/Maybe.ts";

export type DumpstersMapProps = {
    dumpsters: DumpsterData[],
    selectDumpster: (dumpster: DumpsterData) => void,
    selected: DumpsterData | undefined
};

type DumpsterAtMap = {
    isSelected: boolean,
    onSelect: () => void,
    hooverData: string | ReactElement | ReactNode
    position: {
        lat: number,
        lng: number
    }
}

function toDumpsterAtMap(dumpster: DumpsterData, select: (dumpster: DumpsterData) => void, selected: DumpsterData | undefined): DumpsterAtMap {
    const onSelect = () => select(dumpster);
    const isSelected = selected !== undefined && selected.dumpsterCode === dumpster.dumpsterCode;
    const hooverData = <div>#{dumpster.dumpsterCode}</div>
    return {
        isSelected,
        onSelect,
        hooverData,
        position: {
            lat: dumpster.gpsCoordinates?.latitude || 0,
            lng: dumpster.gpsCoordinates?.longitude || 0
        }
    }


}

const defaultIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [15, 21],
    iconAnchor: [1, 1],
    popupAnchor: [1, -14],
    shadowSize: [41, 41]
});

const selectedIcon = new Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


type LeftLetCoords = { lat: number, lng: number };


function getCoordinates(dumpster: DumpsterData | undefined): Maybe<LeftLetCoords> {

    if (!dumpster) return nothing();
    const {gpsCoordinates} = dumpster;
    if (gpsCoordinates === undefined) return nothing();
    if (gpsCoordinates.longitude === undefined) return nothing();
    if (gpsCoordinates.latitude === undefined) return nothing();
    return just({
        lat: gpsCoordinates.latitude,
        lng: gpsCoordinates.longitude
    })
}

function isNullIsland(coords: GPSData): boolean {
    return coords === undefined || coords.latitude === 0 || coords.longitude === 0;
}

// hookeo la referencia al mapa para poder hacer un flyTo y que se vea más lindo
function SmoothMapMovement(props: { selected: DumpsterData | undefined }) {
    const map = useMap();
    const selected = props.selected;
    useEffect(() => {
        if (selected) {
            const {gpsCoordinates} = selected;
            if (gpsCoordinates && !isNullIsland(gpsCoordinates)) {
                map.flyTo([gpsCoordinates.latitude, gpsCoordinates.longitude], map.getZoom(), {
                    duration: 1.5 // Duración en segundos
                });
            }
        }
    }, [selected, map]);

    return null;
}

export const DumpstersMap = (props: DumpstersMapProps) => {
    const {dumpsters, selectDumpster, selected} = props;
    const mapPoints: DumpsterAtMap[] = dumpsters.map(d => toDumpsterAtMap(d, selectDumpster, selected));

    let center = mapPoints.length > 0
        ? {lat: mapPoints[0].position.lat, lng: mapPoints[0].position.lng}
        : {lat: -38.7150600467283, lng: -62.25485200946408}; // Bahía Blanca

    // if there is many points, calculate the center
    if (mapPoints.length > 1) {
        const maxLat = Math.max(...mapPoints.map(p => p.position.lat));
        const minLat = Math.min(...mapPoints.map(p => p.position.lat));
        const maxLng = Math.max(...mapPoints.map(p => p.position.lng));
        const minLng = Math.min(...mapPoints.map(p => p.position.lng));
        center = {
            lat: (maxLat + minLat) / 2,
            lng: (maxLng + minLng) / 2
        };
    }

    // si hay un volquete seleccionado, que ese sea el centro
    center = getCoordinates(selected).orElse(center);


    return (
        <div className={"dumpsters-map-container"}>
            <MapContainer
                center={center}
                zoom={13}
                className={"dumpsters-map"}
                // key={`${center.lat}-${center.lng}`}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <SmoothMapMovement selected={selected}/>
                {mapPoints.map(CreateMarker)}
            </MapContainer>
        </div>
    );

    function CreateMarker(point: DumpsterAtMap, index: number) {
        const icon = point.isSelected ? selectedIcon : defaultIcon;
        return (
            <Marker
                key={index}
                position={point.position}
                icon={icon}
                eventHandlers={{
                    click: point.onSelect
                }}
            >
                <Popup>
                    {point.hooverData}
                </Popup>
            </Marker>
        );
    }
};
