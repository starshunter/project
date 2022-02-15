import '../../App.css';
import { Input, Space, Menu, Button, message, Form, Modal, Select, Affix } from 'antd';
import { BulbOutlined, SettingFilled, SketchOutlined, AliwangwangOutlined, DollarCircleFilled, SmileFilled, HomeFilled } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { uploadForm} from '../../axios';
import Set from './Set';
import QuestionByPage from './QuestionByPage';
import QuestionByUser from './QuestionByUser';
import CommentByUser from './CommentByUser';




const { Search } = Input;

const PostForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
    <Modal visible={visible} title="我有問題..." okText="發問" cancelText="取消" onCancel={onCancel}
      onOk={() => {form.validateFields().then((values) => {
        form.resetFields();
        onCreate(values);
      }).catch((info) => {
        console.log('失敗訊息:', info);
      });
    }}
    icon={{ color: '#ff2a00' }}>
      <Form form={form} layout="vertical" name="form_in_modal" initialValues={{modifier: 'public',}}>
        <Form.Item name="topic" label="主旨" rules={[{required: true, message: '請輸入主旨!',},]}>
          <Input />
        </Form.Item>
        <Form.Item name="category" label="種類" rules={[{required: true, message: '請選擇種類!',},]}>
          <Select>
            <Select.Option value="life">生活</Select.Option>
            <Select.Option value="relationship">感情</Select.Option>
            <Select.Option value="academic">學術</Select.Option>
            <Select.Option value="leisure">休閒</Select.Option>
            <Select.Option value="political">政治</Select.Option>
            <Select.Option value="others">其他</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name='description' label="內容" rules={[{required: true, message: '請輸入內容!',},]}>
          <Input.TextArea rows={10}/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

const Main = ({ setSignIn }) => {
  const { SubMenu } = Menu;
  const [state, setState] = useState("main");
  const [keyword, setKeyword] = useState("");

  const handleClick = e => {
    console.log('click ', e);
  };

  const handleLogout = () => {
    setSignIn("false");
    localStorage.removeItem('mail');
    localStorage.removeItem('name');
    localStorage.removeItem('birth');
    localStorage.removeItem('coin');
    localStorage.removeItem('xp');
    localStorage.removeItem('intro');
    localStorage.removeItem('uid');
  }

  useEffect(()=>{
  }, [localStorage.getItem("xp")])

  const onSearch = (value) => {
    setKeyword(value)
  };

  const [visiblePostForm, setVisiblePostForm] = useState(false);

  const error = () => {
    message.error('發文出現問題');
  };

  const success = () => {
    message.success('發送成功');
  };

  const errorNotEnough = () => {
    message.error('餘額不足');
  };

  const onCreateForm = async (values) => {
    let res;
    if (localStorage.getItem('coin') < 5)
      res = {msg: 'notEnough'};
    else 
      res = await uploadForm(values, localStorage.getItem('uid'));
    if (res.msg === 'failure') {
      error()
    } else if (res.msg === 'success') {
      success()
      localStorage.setItem('coin', res.user.coin)
      localStorage.setItem('xp', res.user.xp)
    } else {
      errorNotEnough()
    }
    setVisiblePostForm(false);
  };
  
  const webType = () => {
    switch(state) {

      case "main":   return <QuestionByPage keyword={keyword}/>
      case "myQuestion":  return <QuestionByUser/>
      case "myComment": return <CommentByUser/>
      case "settings":   return <Set />;

      default:      return <h1>Error</h1>
    }
  }

  return(
    <div className='main-all'>
      <div className='main-menu'>
        <Menu
          onClick={handleClick}
          className="menu-style"
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
        >
          <Menu.ItemGroup key="name" title={'您好, '+localStorage.getItem("name")}>
            <SubMenu key='user_status' title="狀態" icon={<SmileFilled />}>
              <Menu.Item key='level' icon={<SketchOutlined />}>
                等級: {Math.floor(Math.log(parseInt(localStorage.getItem('xp'))+10) / Math.log(10))}
              </Menu.Item>
              <Menu.Item key='credit' icon={<DollarCircleFilled />}>
                餘額: {localStorage.getItem('coin')}
              </Menu.Item>
            </SubMenu>
          </Menu.ItemGroup>
          <Menu.Divider />
          <Menu.Item key='main' icon={<HomeFilled />} onClick={() => setState("main")}>
            首頁
          </Menu.Item>
          <Menu.Item key='posts' icon={<AliwangwangOutlined />} onClick={() => setState("myQuestion")}>
            我的問題
          </Menu.Item>
          <Menu.Item key='comments' icon={<BulbOutlined />} onClick={() => setState("myComment")}>
            我的回答
          </Menu.Item>
          <Menu.Item key='settings' icon={<SettingFilled />} onClick={() => setState("settings")}>
            設定
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key='logout'>
            <Button onClick={handleLogout}>登出</Button>
          </Menu.Item>
        </Menu>
      </div>
      <div className='main-content' >
        { 
          state === 'main' ?
            <>
              <Affix offsetTop='0'>
                <Space className='header_bar' style={{position:'fixed', justifyContent:'center'}}>
                  <Search  size='large' placeholder="查詢關鍵字..." onSearch={onSearch} enterButton style={{width:'40vw'}}/>
                  <Button className='login' type="primary" onClick={() => {setVisiblePostForm(true);}} size='large'>我有問題...</Button>
                  <PostForm visible={visiblePostForm} onCreate={onCreateForm} onCancel={() => {setVisiblePostForm(false);}}/>
                </Space>
              </Affix>
            </> 
          : 
          <></>
        }
        <div className='scroll_page'>{ webType() }</div>
      </div>
    </div>
  );
}
  
export default Main;