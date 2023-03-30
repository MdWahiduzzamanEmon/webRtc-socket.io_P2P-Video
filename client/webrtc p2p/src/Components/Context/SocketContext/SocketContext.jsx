
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';

export const socketContext = React.createContext(null);

let socket =io('http://localhost:4000', {
    transports: ['websocket', 'polling', 'flashsocket']
})

const SoketProvider = ({ children }) => {
   
    // const socket = useMemo(() => {
    //     return socketData
    // }, [socketData]);


    return (
        <socketContext.Provider value={
            {
                socket
            }
        }>
            {children}
        </socketContext.Provider>
    )
}

export default SoketProvider;


export const useSocket = () => useContext(socketContext);