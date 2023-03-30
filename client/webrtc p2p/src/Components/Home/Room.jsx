import { usePeer } from '../Context/PeerContext/PeerContext';
import { useSocket } from '../Context/SocketContext/SocketContext';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player'

const Room = () => {
    const { socket } = useSocket();
    const { peer, createOffer, createAnswer, remoteDescriptionAns, remoteStream, sendStream } = usePeer();
    const [myStream, setMyStream] = useState(null);
    const [remoteEmailId, setRemoteEmailId] = useState(null);

    const handleNewUSerJoined = useCallback(async (data) => {
        console.log(data);
        const offer = await createOffer();
        socket.emit('call-user', {
            offer,
            emailId: data.emailId
        })
        setRemoteEmailId(data.emailId);
    }, [socket, createOffer])

    const handleIncomigCall = useCallback(async (data) => {
        const { offer, from } = data;
        const answer = await createAnswer(offer);
        console.log(answer);
        socket.emit('call-accepted', {
            answer,
            emailId: from
        })

        setRemoteEmailId(from);
    }, [socket, createAnswer])

    const handleCallAccepted = useCallback(async (data) => {
        const { answer } = data;
        // console.log(answer);
        await remoteDescriptionAns(answer);
    }, [remoteDescriptionAns])

    const getUserMedia = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        console.log(stream);
        setMyStream(stream);
    }, [])

    const handleNegotiationNeeded = useCallback(async () => {
        console.log("negotiation needed");
        const offer = await createOffer();
        socket.emit('call-user', {
            offer,
            emailId: remoteEmailId
        })
    }, [socket, createOffer, remoteEmailId])


    useEffect(() => {
        socket.on('user-joined', handleNewUSerJoined);
        socket.on("incoming-call", handleIncomigCall)
        socket.on("call-accepted", handleCallAccepted)

        return () => {
            socket.off('user-joined', handleNewUSerJoined);
            socket.off("incoming-call", handleIncomigCall)
            socket.off("call-accepted", handleCallAccepted)
        }

    }, [socket])

    useEffect(() => {
        getUserMedia()
    }, [getUserMedia])



    useEffect(() => {
        peer.addEventListener("negotiationneeded", handleNegotiationNeeded);

        return () => {
            peer.removeEventListener("negotiationneeded", handleNegotiationNeeded);
        }
    }, [peer, handleNegotiationNeeded])

    console.log(remoteStream);

    return (
        <div>
            <h1>Room</h1>
            <h4>
                You are connected with {remoteEmailId}
            </h4>
            <button onClick={() => sendStream(myStream)}>Send Stream</button>
            <ReactPlayer url={myStream} playing muted />
           {
                <video
                    ref={remoteStream}
                    autoPlay
                    playsInline
                    muted
                />
                
           }
            {/* //send offer  */}

        </div>
    );
};

export default Room;