import '../../App.css';
import { Form, Input, Button, Modal, message } from 'antd';
import { changeSettings, changePassword } from '../../axios';
import { useState } from 'react';

const ChangePasswordForm = ({ visible, onCreate, onCancel }) => {
  const [form] = Form.useForm();
  return (
      <Modal visible={visible} title="修改密碼" okText="更改" cancelText="取消" onCancel={onCancel}
          onOk={() => {form.validateFields().then((values) => {
              form.resetFields();
              onCreate(values);
          }).catch((info) => {
              console.log('Validate Failed:', info);
          });
      }}>
          <Form form={form} layout="vertical" name="form_in_modal" initialValues={{modifier: 'public',}}>
              <Form.Item name="password" label="密碼" rules={[{required: true, message: '請輸入密碼!',},]} hasFeedback>
                  <Input.Password />
              </Form.Item>
              <Form.Item name="newPassword" label="新密碼" rules={[{required: true, message: '請輸入新密碼!',},]} hasFeedback>
                  <Input.Password />
              </Form.Item>
              <Form.Item name="confirm" label="確認新密碼" dependencies={['newPassword']} hasFeedback rules={[{required: true, message: '請確認新密碼!',}, ({ getFieldValue }) => ({validator(_, value) {if (!value || getFieldValue('newPassword') === value) {return Promise.resolve();} return Promise.reject(new Error('The two passwords that you entered do not match!'));},}),]}>
                  <Input.Password />
              </Form.Item>
          </Form>
      </Modal>
  );
};

const Set = () => {

    const [form] = Form.useForm();
    const [ visiblePassword, setVisiblePassword ] = useState(false);

    const onChange = async (values) => {
      if (!values.intro) {
        values.intro = ""
      }
      const res = await changeSettings(values, localStorage.getItem('uid'));
      if (res === 'failure') {
          error()
      } else {
          localStorage.setItem('intro', values.intro)
          success()
      }
    };

    const onChangePassword = async (values) => {
      setVisiblePassword(false);
      const res = await changePassword(values, localStorage.getItem('uid'));
      if (res === 'failure') {
          error()
      } else {
          success()
      }
    };
    
    const error = () => {
      message.error('更改失敗');
    };
  
    const success = () => {
      message.success('更改成功');
    };

    return (
      <div className="settings">
        <Form form={form} layout="vertical" name="settings" onFinish={(values) => onChange(values)} initialValues={{
        'intro': localStorage.getItem('intro')
        }}>
          <Form.Item label="帳號">
            <Input placeholder={localStorage.getItem('mail')} disabled />
          </Form.Item>
          <Form.Item label="名字">
            <Input placeholder={localStorage.getItem('name')} disabled />
          </Form.Item >
          <Form.Item label="生日">
            <Input placeholder={localStorage.getItem('birth')} disabled />
          </Form.Item >
          <Form.Item name='intro' label="自我介紹">
            <Input.TextArea rows={10} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login">
              更改自介
            </Button>
          </Form.Item>
        </Form>
        <Button type="primary" onClick={() => {setVisiblePassword(true);}} className='login'>更改密碼</Button>
        <ChangePasswordForm visible={visiblePassword} onCreate={onChangePassword} onCancel={() => {setVisiblePassword(false);}}/>
      </div>
    );
}

export default Set;