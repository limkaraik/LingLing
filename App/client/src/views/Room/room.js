import React, { useEffect, useState, useRef } from 'react';
import RecordRTC from 'recordrtc'
import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import {Button, Col, Row} from 'antd'
// import Chat from './chat'
import API from '../../Utils/baseUrl'

import Messages from './Messages/Messages';
import InfoBar from './InfoBar/InfoBar'
import Input from './Input/input'

import './chat.css'

const Video = styled.video`
  border: 8px solid white;
  width: 100%;
  height: 100%;
`;


function Room(props) {
    //record stuff
    let recorder;
    const [blob, setBlob] = useState({});
    const [Recorder, setRecorder] = useState();
    const [Num, setNum] = useState(0);
    let num = 0;
    const [Can, setCan] = useState(true);
    const [yourID, setYourID] = useState("");
    const [users, setUsers] = useState({});
    const [stream, setStream] = useState();
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const userVideo = useRef();
    const partnerVideo = useRef();
    const socket = useRef();

    useEffect(() => {
        socket.current = io.connect("http://localhost:5000");
        let userData = {name:props.name,room:props.room}
        socket.current.emit('userData', userData)
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
          setStream(stream);
          handleVideo(stream);
          if (userVideo.current) {
            userVideo.current.srcObject = stream;
          }
        }).catch(e=>{
            console.log(e)
        })

        socket.current.on('init',  (id)=>{
            setYourID(id)
        })
        
        socket.current.on("allUsers", (users) => {
          setUsers(users);
          num++
          setNum(num)
          
        })

        socket.current.on("dcUsers",(users)=>{
            setUsers(users);
        })
    
    
        socket.current.on("hey", (data) => {
          setReceivingCall(true);
          setCaller(data.from);
          setCallerSignal(data.signal);
        })
       
      }, []);
////////////////////////////////////

      useEffect(() => {
        socket.current.on('message', message => {
          setMessages(messages => [ ...messages, message ]);
        });
        
    }, []);

/////////// recording stuff    ///////////////////////////////////
  
    const handleVideo = (stream) => {
        const video = document.getElementById('player');
        // video.muted = true;
        // video.volume = 0;
        // video.srcObject = stream;
    
        recorder = new RecordRTC(stream, {
            type:'audio',
          mimeType: 'audio/wav',
          recorderType: RecordRTC.StereoAudioRecorder,
          
          video: {
            width: 240,
            height: 320,
          },
          canvas: {
            width: 640,
            height: 480, // video and canva width, height doesnt work
          },
        });
        recorder.startRecording();
        setRecorder(recorder)
      }
    
   
    
    const stopRecording = () => {
        Recorder.stopRecording(async () => {
            const blob = await Recorder.getBlob();
            var fileName = 'dope' + '.wav';
            var file = new File([blob],fileName,{
                type:'audio/wav'
            })
            sendAudio(file)
            setBlob(blob);
        });
        
    }

    const sendAudio = (file)=>{
        const config = {
            header: { 'content-type': 'multipart/form-data' },
          };
        const formData = new FormData()
        formData.append('files',file)
        formData.append('meetingId',props.meetingId)
        API.post('api/meeting/upload',formData,config).then((res)=>{
            console.log(res)
        }).catch(err=>{console.log('error sending audio')})
    }

/////////////////////////////////////////////////
    if (Num===2 && Object.keys(users).length===2 &&Can){
        setCan(false)
        Object.keys(users).map(key => {
        if (key !== yourID) {
            callPeer(key)
        }
    })
    }
////////////////////////////////////////////////////////
    
    function callPeer(id) {
        console.log('calling')
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
//////////////////////////////////////////////

    
    function acceptCall() {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
        });
        peer.on("signal", data => {
    
            console.log('caller',caller)
            socket.current.emit("acceptCall", { signal: data, to: caller })
        })

        peer.on("stream", stream => {
            partnerVideo.current.srcObject = stream;
        });
        console.log('callerSignal',callerSignal)
        peer.signal(callerSignal);
        }

        let UserVideo;
        if (stream) {
        UserVideo = (
            <Video playsInline muted ref={userVideo} autoPlay />
        );
    }
////////////////////////////////////////////

    if (receivingCall && callerSignal&& !callAccepted){
        acceptCall()
    }

////////////////////////////////////////////////////
    const endCall = ()=>{
        stopRecording()
        socket.current.close()
        setCallAccepted(false)
        setCaller("")
        setReceivingCall(false)
        setCallerSignal()
        socket.current.emit("disconnect",props.room)
        props.quit()
    }
    
////////////////////////////////////////////////

    const sendMessage = (event) => {
        event.preventDefault();

        if(message) {
            let data = {msg:message,room:props.room}
        socket.current.emit('sendMessage', data, () => setMessage(''));
        }
    }


    return (
        <div>
            <div style ={{ textAlign: 'center'}}>
                <h2>Welcome {props.name} to {props.room}</h2>
            </div>

            <div style={{width:'100%', paddingTop:'25px'}}>
                <div>
                    <Row>  
                        <Col span={8}>{UserVideo}</Col>
                        <Col span={8}>{callAccepted && (Object.keys(users).length>1) &&
                            <Video playsInline ref={partnerVideo} autoPlay />
                        }</Col>
                        <Col span={8}>
                        <div className="outerContainer">
                            <div className="container">
                                <InfoBar room={props.room} />
                                <Messages messages={messages} name={props.name} />
                                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                            </div>
                            </div>
                        </Col>
                    </Row>
                    <div style = {{maxWidth: '700px', margin:'2rem auto'}}>
                            <Button 
                            block
                            type='danger'
                            size='large'
                            shape='round'
                            onClick={endCall} >End Call</Button>
                        {/* { (receivingCall && !callAccepted)&& incomingCall} */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Room
