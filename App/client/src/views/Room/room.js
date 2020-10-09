import React, { useEffect, useState, useRef } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import {Button, Col, Row} from 'antd'
import Chat from './chat'
// import {addMeeting} from '../../../../_actions/user_actions'
import {useDispatch} from 'react-redux'

const Video = styled.video`
  border: 8px solid white;
  width: 100%;
  height: 100%;
`;


function Room(props) {
    const dispatch = useDispatch();

    const [yourID, setYourID] = useState("");
    const [users, setUsers] = useState({});
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);

    const userVideo = useRef();
    const partnerVideo = useRef();
    const socket = useRef();

    useEffect(() => {
        socket.current = io.connect("http://localhost:5000");
        socket.current.emit('userData', props.userData)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
          setStream(stream);
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }
        })

        socket.current.on('init',  (id)=>{
            setYourID(id)
        })

        // socket.current.on("yourID", (id) => {
        //     setYourID(id);
        // })
        
        socket.current.on("allUsers", (users) => {
          setUsers(users);
        })
    
        socket.current.on("hey", (data) => {
          setReceivingCall(true);
          setCaller(data.from);
          setCallerSignal(data.signal);
        })
      }, []);
    
    function callPeer(id) {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
    });

    peer.on("signal", data => {
        socket.current.emit("callUser", { userToCall: id, signalData: data, from: yourID })
    })

    peer.on("stream", stream => {
        if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
        }
    });

    socket.current.on("callAccepted", signal => {
        setCallAccepted(true);
        peer.signal(signal);
    })

    }

    function acceptCall() {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
    });
    peer.on("signal", data => {
        socket.current.emit("acceptCall", { signal: data, to: caller })
    })

    peer.on("stream", stream => {
        partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    }

    let UserVideo;
    if (stream) {
    UserVideo = (
        <Video playsInline muted ref={userVideo} autoPlay />
    );
    }

    let PartnerVideo;
    if (callAccepted) {
    PartnerVideo = (
        <Video playsInline ref={partnerVideo} autoPlay />
    );
    
    }

    let incomingCall;
    if (receivingCall) { 
    incomingCall = (
        <div>
            {
                callAccepted ? <br/> :
                <div style={{textAlign: 'center'}}>  
                <h1>{caller && users[caller].name} is calling you</h1>
                <Button 
                block
                type='primary'
                size='large'
                onClick={acceptCall}>Accept</Button>
                </div>
            }
        
        </div>
    )
    }
    const endCall = ()=>{
        
        setCallAccepted(false)
        setCaller("")
        setReceivingCall(false)
        setCallerSignal()
        // dispatch(addMeeting(1))
    }

    const renderFriends = ()=>(
        <div style={{justifyContent:'center'}}>
            <h3 style={{textAlign:'center'}}><span>Friends List</span></h3>
            {Object.keys(users).map(key => {
                if (key === yourID) {
                    return null;
                }
                else if (!callAccepted) return (
                <div style={{justifyContent:'center', display:'flex'}}>
                    <Button size='large' onClick={() => callPeer(key)}>Call {users[key].name}</Button>
                </div>
                );
            })}
        </div>
    )

    
    return (
        <div>
            <div style ={{ textAlign: 'center'}}>
                <h2>Welcome {props.userData.name}</h2>
            </div>

            <div style={{width:'100%', paddingTop:'25px'}}>
                <div>
                    <Row>  
                        <Col span={8}>{UserVideo}</Col>
                        <Col span={8}>{PartnerVideo}</Col>
                        <Col span={8}>
                            {
                                callAccepted ? <Chat name={users[yourID] && users[yourID].name}/>
                                :
                                renderFriends()
                            }
                            
                        </Col>
                    </Row>
                    <div style = {{maxWidth: '700px', margin:'2rem auto'}}>
                        { callAccepted &&
                            <Button 
                            block
                            type='danger'
                            size='large'
                            shape='round'
                            onClick={endCall} >End Call</Button>
                        }
                        { (receivingCall && !callAccepted)&& incomingCall}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Room
