import React , { useState,useEffect } from 'react'
import { Button, Typography,  Form,Input } from 'antd';
import API from '../Utils/baseUrl';
import Room from './Room/room'
const { Title } = Typography;


function Home(props) {
    const [RoomName, setRoomName] = useState("");
    const [User, setUser] = useState('');
    const [OnRoom, setOnRoom] = useState(false);
    const [MeetingId, setMeetingId] = useState('');

    useEffect(()=>{
        handleAuth();
    },[])

    const quitCall = ()=>{
        setOnRoom(false)
        API.get(`api/meeting/exit?name=${RoomName}`)
    }

    const handleAuth = ()=>{
        API.get('api/user/auth').then((res) => {
            const { success, name } = res.data;
            if (success) {
              setUser(name)
            }
            else{
                props.history.push('/login')
            }
        });
    }


    const handleRoomChange = (event) =>{
        setRoomName(event.currentTarget.value)
    }

    const handleCreateSubmit = ()=>{
        setOnRoom(true)
        API.get(`api/meeting/enter?name=${RoomName}`).then((res)=>{
            const {success,id} = res.data
            if (success){
                setMeetingId(id)
                API.get(`api/user/addMeeting?meetingId=${id}`)
            }
        })
    }

    return (
        <div>
        {(OnRoom)? <Room name={User} room={RoomName} meetingId={MeetingId} quit={quitCall}/>
        :
        <div>
            <Title level={2}>Create or Enter Room</Title>
            <Form layout={'vertical'} size={'large'} >
                <Form.Item
                    label="Room Name"
                    rules={[
                        {
                            required: true,
                            message: 'Please input Room Name!',
                        }
                    ]}
                >
                    <Input onChange={handleRoomChange} value={RoomName}/>
                </Form.Item>
                
                <Form.Item >
                    <Button type="primary" htmlType="submit" onClick={handleCreateSubmit}>
                        Create/Enter Room
                    </Button>
                </Form.Item>
            </Form>
        </div>
        }
        </div>
    )
}

export default Home
