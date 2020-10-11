import React from 'react'
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu, Layout } from 'antd';



const { Header, Content, Footer } = Layout;

  function handleMenuClick(e) {
  console.log('click', e);
  }
  
  const { SubMenu } = Menu;
  
  class NavBar extends React.Component{
      
    state = {
      current: 'mainMenu',
    };
  
    handleClick = e => {
      console.log('click ', e);
      this.setState({ current: e.key });
    };
  
    render() {
      const { current } = this.state;
      return(
        <Menu onClick={this.handleClick} selectedKeys={[current]} theme="dark" mode="horizontal" >
        <Menu.Item key="Login" icon={<AppstoreOutlined />}>
            Login<a href="/login"></a>
          </Menu.Item>
          <Menu.Item key="Sign up"  icon={<AppstoreOutlined />}>
            Sign up<a href="/signup"></a>
          </Menu.Item>
        
          
        </Menu>
        
      );
    }
  
  }

export default NavBar
