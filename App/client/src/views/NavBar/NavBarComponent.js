import React, { useState } from 'react';
import RightMenu from './RightMenu';
import { Drawer, Button } from 'antd';
import NavBar from './NavBar'
import { Icon, InlineIcon } from '@iconify/react';
import alignRightOutlined from '@iconify/icons-ant-design/align-right-outlined';

function NavBarComponent() {
  const [visible, setVisible] = useState(false)

  const showDrawer = () => {
    setVisible(true)
  };

  const onClose = () => {
    setVisible(false)
  };

  return (
    <nav style={{ position: 'fixed', zIndex: 5, width: '100%' }}>
      <div theme="dark">
        <Button
          type="primary"
          onClick={showDrawer}
        ><Icon icon={alignRightOutlined} />
        </Button>
        <Drawer
          title="Account settings"
          placement="right"
          closable={false}
          onClose={onClose}
          visible={visible}
        >
          <RightMenu mode="inline" />
          
        </Drawer>

        <div className="menu_left">
          <NavBar mode="horizontal" />
        </div>
            
      </div>
    </nav>
  )
}

export default NavBarComponent