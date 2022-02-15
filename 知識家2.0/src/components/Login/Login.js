import '../../App.css';
import { Form, Input, Button, Modal, message, DatePicker } from 'antd';
import React, { useState } from 'react';
import { login, signup } from '../../axios';

const CollectionCreateForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
        <Modal visible={visible} title="註冊" okText="註冊" cancelText="取消" onCancel={onCancel}
            onOk={() => {form.validateFields().then((values) => {
                form.resetFields();
                onCreate(values);
            }).catch((info) => {
                console.log('Validate Failed:', info);
            });
        }}>
            <Form form={form} layout="vertical" name="form_in_modal" initialValues={{modifier: 'public',}}>
                <Form.Item name="mail" label="帳號" rules={[{required: true, message: '請輸入信箱!',},]}>
                    <Input />
                </Form.Item>
                <Form.Item name="name" label="姓名" rules={[{required: true, message: '請輸入姓名!',},]}>
                    <Input />
                </Form.Item>
                <Form.Item name='birth' label="生日" rules={[{required: true, message: '請選擇生日!',},]}>
                    <DatePicker />
                </Form.Item>
                <Form.Item name="password" label="密碼" rules={[{required: true, message: '請輸入密碼!',},]} hasFeedback>
                    <Input.Password />
                </Form.Item>
                <Form.Item name="confirm" label="確認密碼" dependencies={['password']} hasFeedback rules={[{required: true, message: '請確認密碼!',}, ({ getFieldValue }) => ({validator(_, value) {if (!value || getFieldValue('password') === value) {return Promise.resolve();} return Promise.reject(new Error('The two passwords that you entered do not match!'));},}),]}>
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const Login = ({ setSignIn }) => {

    const layout = {
        labelCol: {
          span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };

    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };

    const error1 = () => {
        message.error('帳號或密碼錯誤');
    };

    const error2 = () => {
        message.error('此帳號已註冊');
    };

    const success = () => {
        message.success('註冊成功');
    };

    const onFinish = async (values) => {
        const res = await login(values);
        console.log(res)
        if (res === 'failure') {
            error1()
        } else {
            const birth = res.birth.substring(0, 10);
            localStorage.setItem('mail', res.mail);
            localStorage.setItem('name', res.name);
            localStorage.setItem('birth', birth);
            localStorage.setItem('coin', res.coin);
            localStorage.setItem('xp', res.xp);
            localStorage.setItem('intro', res.intro);
            localStorage.setItem('uid', res.uid);
            setSignIn("true");
        }
    }
    
    const [visible, setVisible] = useState(false);

    const onCreate = async (values) => {
        setVisible(false);
        const res = await signup(values);
        if (res === 'failure') {
            error2()
        } else {
            success()
        }
    };

    return (
        <div className="App">
            <div className="App-title">知識家 2.0</div>
            <div className="App-login">
                <Form {...layout} name="basic" initialValues={{remember: true,}} onFinish={onFinish}>
                    <Form.Item label={<label style={{ color: "snow" }}>帳號</label>} name="mail" rules={[{required: true, message: '請輸入您的帳號!',},]}>
                        <Input />
                    </Form.Item>
                    <Form.Item className="text" label={<label style={{ color: "snow" }}>密碼</label>} name="password" rules={[{required: true, message: '請輸入您的密碼!',},]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button type="primary" className='login' htmlType="submit">登入</Button>
                    </Form.Item>
                </Form>
                <Button type="primary" onClick={() => {setVisible(true);}} className='signup'>註冊</Button>
                <CollectionCreateForm visible={visible} onCreate={onCreate} onCancel={() => {setVisible(false);}}/>
            </div>
        </div>
    );
}

export default Login;