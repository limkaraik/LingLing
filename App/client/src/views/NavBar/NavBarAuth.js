import React from 'react'
import {AppstoreOutlined } from '@ant-design/icons';
import { Menu } from 'antd';



  class NavBarAuth extends React.Component{
      
    state = {
      current: 'main',
    };
  
    handleClick = e => {
      console.log('click ', e);
      this.setState({ current: e.key });
    };
  
    render() {
      const { current } = this.state;
      return(
        <Menu onClick={this.handleClick} selectedKeys={[current]} theme="dark" mode="horizontal" >
        <Menu.Item key="Join a Room" icon={<AppstoreOutlined />}>
            Home<a href="/"></a>
          </Menu.Item>
          <Menu.Item key="Meeting History"  icon={<AppstoreOutlined />}>
            Meeting History<a href="/MeetingHistory"></a>
          </Menu.Item>
          <Menu.Item key="Logout"  icon={<AppstoreOutlined />}>
            Logout<a href="/Login"></a>
          </Menu.Item>
        
          
        </Menu>
        
      );
    }
  
  }

export default NavBarAuth
