import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const peerContext = React.createContext(null);

const PeerProvider = ({ children }) => {
    const remoteStream = useRef(null);
    const peer = useMemo(() => new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    'stun:stun.l.google.com:19302',
                    'stun:global.stun.twilio.com:3478'
                ]
            }
        ]
    }), []);

    const createOffer = useCallback(async () => {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        return offer;
    }, [peer]);

    const createAnswer = useCallback(async (offer) => {
        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        return answer;
    }, [peer]);

    const remoteDescriptionAns = useCallback(async (answer) => {
        await peer.setRemoteDescription(answer);
    }, [peer]);

    const sendStream = useCallback(async (stream) => {
        console.log(stream);
        const tracks = stream.getTracks();
        for (const track of tracks) {
            peer.addTrack(track, stream);
        }
        console.log(peer);
    }, [peer]);

    const streamFunction = useCallback(async (e) => {
        const streams = e.streams;
        remoteStream.current.srcObject = streams[0];
        console.log(streams[0]);

    }, []);

    useEffect(() => {
        peer.addEventListener('track', streamFunction);
        return () => {
            peer.removeEventListener('track', streamFunction);
        }
    }, [peer, streamFunction]);



    return (
        <peerContext.Provider value={
            {
                peer,
                createOffer,
                createAnswer,
                remoteDescriptionAns,
                sendStream,
                remoteStream
            }
        }>
            {children}
        </peerContext.Provider>
    )
}

export default PeerProvider;

export const usePeer = () => useContext(peerContext);