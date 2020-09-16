import React, { useState } from "react";
import { Button, Typography, Alert, Col,Row, Form,Input } from 'antd';
import API from '../../Utils/baseUrl';
import { isStrongPassword } from '../../Utils/passwordValidation';
const { Title } = Typography;


function Register(props) {
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [DifferentPassword, setDifferentPassword] = useState(true);
    const [StrongPassword, setStrongPassword] = useState(false);
    const [EmailExist, setEmailExist] = useState(false);

    const handleSubmit = ()=>{
        let data = {email:Email, password: Password};
        API.post('api/user/register',data).then(res=>{
            const success = res.data.success;
            if (success){
                API.post('api/user/login',data).then(res=>{
                const success = res.data.success;
                if (success){
                    props.history.push("/");
                    }
                })
            }else {
                setEmailExist(true)
            }
        })
    }

    const handleLogin = () => {
        props.history.push({
          pathname: '/login'
        });
      };

    const handleEmailChange = (event) =>{
        setEmail(event.currentTarget.value)
    }

    const handlePasswordChange = (event)=>{
        setPassword(event.currentTarget.value);
        setStrongPassword(isStrongPassword(event.currentTarget.value));
    }

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.currentTarget.value)
        if (event.currentTarget.value !== Password){
            setDifferentPassword(true)
        }else{
            setDifferentPassword(false)
        }
    }

    return (
        <div>
            <Row>
            <Col span={12}>
                Ling Ling Logo
            </Col>
            <Col span={10}>
                <Title level={2}>Sign Up</Title>
                <Form layout={'vertical'} size={'large'}>
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
                    <Form.Item
                        label="Confirm Password"
                    >
                        <Input.Password onChange={handleConfirmPasswordChange} value={ConfirmPassword}/>
                    </Form.Item>
                    {!StrongPassword && <Alert
                    message=""
                    description="Password must be: 8 to 20 characters long, include at least one digit, uppercase and lowercase letter"
                    type="error"
                    showIcon/>}
                    {DifferentPassword && <Alert
                    message=""
                    description="Passwords do not match"
                    type="error"
                    showIcon/>}
                    {EmailExist && <Alert
                    message=""
                    description="Email already exist. Please choose another email."
                    type="error"
                    showIcon/>}
                    <br></br>
                    <Form.Item >
                        <Button type="primary" htmlType="submit" onClick={handleSubmit}>
                            Sign Up
                        </Button>
                    </Form.Item>
                    <div style={{marginTop:'115px', top:'70%',position:'absolute', right:'18%', color:'#75787b'}}>
                        Already have an account?
                        <Button type="link" onClick={handleLogin} style={{marginLeft:'-10px'}}>
                            Login
                        </Button>
                    </div>
                </Form>
            </Col>
            </Row>
        </div>
    )
}

export default Register
