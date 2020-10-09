import React , { useState } from 'react'
import { Button, Typography, Alert, Col,Row, Form,Input } from 'antd';
const { Title } = Typography;


function Home(props) {
    const [RoomPass, setRoomPass] = useState("");
    const [EnterPass, setEnterPass] = useState("");

    const handleRoomChange = (event) =>{
        setRoomPass(event.currentTarget.value)
    }

    const handleEnterChange = (event) =>{
        setEnterPass(event.currentTarget.value)
    }

    const handleCreateSubmit = ()=>{
        props.history.push(`/room/${RoomPass}`);
    }

    const handleEnterSubmit = ()=>{
        props.history.push(`/room/${EnterPass}`);
    }
    return (
        <div>
            <Title level={2}>Create Room</Title>
            <Form layout={'vertical'} size={'large'} >
                <Form.Item
                    label="Room Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input Room Password!',
                        }
                    ]}
                >
                    <Input onChange={handleRoomChange} value={RoomPass}/>
                </Form.Item>
                
                <Form.Item >
                    <Button type="primary" htmlType="submit" onClick={handleCreateSubmit}>
                        Create Room
                    </Button>
                </Form.Item>
            </Form>
            <Title level={2}>Enter Room</Title>
            <Form layout={'vertical'} size={'large'} >
                <Form.Item
                    label="Room Password"
                    rules={[
                        {
                            required: true,
                            message: 'Please input Room Password!',
                        }
                    ]}
                >
                    <Input onChange={handleEnterChange} value={EnterPass}/>
                </Form.Item>
                
                <Form.Item >
                    <Button type="primary" htmlType="submit" onClick={handleEnterSubmit}>
                        Enter Room
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Home
