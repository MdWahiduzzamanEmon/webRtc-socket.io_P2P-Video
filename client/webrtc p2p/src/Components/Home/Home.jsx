import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePeer } from '../Context/PeerContext/PeerContext';
import { useSocket } from '../Context/SocketContext/SocketContext';

const Home = () => {
    const { socket } = useSocket();
    const navigate = useNavigate();
    const userRoomId = useRef(null);
    const userEmailId = useRef(null);

    const handleJoinedRoom = useCallback(() => {
        navigate(`/room/${userRoomId.current.value}`)

        socket.emit('join-room', {
            roomId: userRoomId.current.value,
            emailId: userEmailId.current.value
        })
    }, [socket, navigate])


    useEffect(() => {
        socket.on('joined-room', handleJoinedRoom);
        return () => {
            socket.off('joined-room', handleJoinedRoom);
        }
    }, [socket, handleJoinedRoom])

   

    return (
        <div>
            <h1>Home</h1>

            <input type="text" placeholder="Enter Room Id"
                ref={userRoomId}
            />
            <input type="text" placeholder="Enter Email Id"
                ref={userEmailId}
            />
            <button
                onClick={handleJoinedRoom}
            >Join Room</button>

        </div>
    );
};

export default Home;