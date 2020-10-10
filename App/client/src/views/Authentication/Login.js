import React, { useState } from "react";
import { Button, Typography, Alert, Col,Row, Form,Input } from 'antd';
import API from '../../Utils/baseUrl';
import 'antd/dist/antd.css'; 

const { Title } = Typography;


function Login(props) {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [InvalidLogin, setInvalidLogin] = useState(false);


    const handleSubmit = ()=>{
        let data = {email:Email, password: Password};
        API.post('api/user/login',data).then(res=>{
            const success = res.data.success;
            if (success){
                props.history.push("/");
            }else {
                setInvalidLogin(true)
            }
        })
    }

    const handleSignUp = () => {
        props.history.push({
          pathname: '/signup'
        });
      };

    const handleEmailChange = (event) =>{
        setEmail(event.currentTarget.value)
    }

    const handlePasswordChange = (event)=>{
        setPassword(event.currentTarget.value)
    }

    return (
        <div>
            <Row style={{marginTop:'20px'}}>
            <Col span={12} style={{marginLeft:'20px'}}>
                <img src={'./MOOZ.png'}/>
            </Col>
            <Col span={10}>
                <Title level={2}>Login</Title>
                <Form layout={'vertical'} size={'large'} >
                    <Form.Item
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            }
                        ]}
                    >
                        <Input onChange={handleEmailChange} value={Email}/>
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            }
                        ]}
                    >
                        <Input.Password onChange={handlePasswordChange} value={Password}/>
                    </Form.Item>
                    {InvalidLogin && <Alert
                    message=""
                    description="Invalid Email or Password"
                    type="error"
                    showIcon/>}
                    <br></br>
                    <Form.Item >
                        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                            Login
                        </Button>
                    </Form.Item>
                    <div style={{marginTop:'50px', top:'70%',position:'absolute', right:'18%', color:'#75787b'}}>
                        New to LingLing?
                        <Button type="link" onClick={handleSignUp} style={{marginLeft:'-10px'}}>
                            Sign Up
                        </Button>
                    </div>
                </Form>
            </Col>
     
            </Row>
        </div>
    )
}

export default Login
