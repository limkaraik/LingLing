import React from 'react';
import { Menu } from 'antd';
import { withRouter } from 'react-router-dom';

function RightMenu() {

    return (
      <Menu theme="dark">
        <Menu.Item key="logout">
          Logout
        </Menu.Item>
      </Menu>
    )
}

export default withRouter(RightMenu);