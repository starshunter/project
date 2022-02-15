import { React, useEffect, useState } from 'react'
import '../../App.css'
import { Input, message, Divider, Button, Form, Modal } from 'antd'
import { addComment, setBestComment, getUserProfile } from '../../axios'
import { FireTwoTone } from '@ant-design/icons'

const UserForm = ({ visible, onOk, onCancel, user }) => {
    const [form] = Form.useForm();
    return (
      <Modal visible={visible} title={user.name} cancelText="取消" onCancel={onCancel} okText='確認' onOk={onOk}
      icon={{ color: '#ff2a00' }}>
        <Form form={form} layout="vertical" name="form_in_modal" initialValues={{modifier: 'public',}}>
          <Form.Item label="帳號">
            <Input placeholder={user.mail} disabled />
          </Form.Item >
          <Form.Item label="生日">
            <Input placeholder={new Date(user.birth)} disabled />
          </Form.Item >
          <Form.Item label="等級">
            <Input placeholder={Math.floor(Math.log(user.xp+10) / Math.log(10))} disabled />
          </Form.Item >
          <Form.Item label="自我介紹">
            <Input.TextArea placeholder={user.intro} rows={10} disabled/>
          </Form.Item>
        </Form>
      </Modal>
    );
  };

export default function QuestionBlock(question){
    const [commentClicked, setCommentClicked] = useState(false);
    const [inputValue, setInputValue] = useState();

    console.log(question)

    const uid = question.question.uid.name
    const quid = question.question.uid._id
    const qid = question.question._id
    const topic = question.question.topic
    const category = question.question.category
    const time = question.question.time
    const description = question.question.description
    const comments = question.question.comments

    const [counter, setCounter] = useState(0)
    const [bestCommentId, setBestCommentId] = useState(question.question.best_comment)
    const [visible, setVisible] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        setCommentClicked(false)
    }, [question])

    const timeCounter = (time) => {
        let timeDifference = Math.abs(new Date(time)- new Date())/1000
        if(timeDifference < 60){
            return("剛剛")
        }
        timeDifference = timeDifference / 60
        if(timeDifference < 60) {
            return(Math.floor(timeDifference).toString() + "分鐘前")    
        }
        timeDifference = timeDifference / 60
        if(timeDifference < 24) {
            return(Math.floor(timeDifference).toString() + "小時前")    
        }
        timeDifference = timeDifference / 24
        if(timeDifference < 30) {
            return(Math.floor(timeDifference).toString() + "天前")   
        }
        timeDifference = timeDifference / 30
        return(Math.floor(timeDifference).toString() + "個月前")   
    }

    useEffect(() =>{
    }, [counter])

    useEffect(() =>{
    }, [bestCommentId])

    const best = async (bestId) => {
        const res = await setBestComment(qid, bestId)
        if (res.msg === 'success') {
            console.log(res.user.coin)
            setBestCommentId(bestId)
            localStorage.setItem("coin", res.user.coin)
            localStorage.setItem("xp", res.user.xp)
        }
    }

    const clickComment =()=>{
        setCommentClicked(!commentClicked);       
    }
    const handleChange =(event) => {
        setInputValue(event.target.value)
    }

    // Error when creating comment
    const sendComment = async(e) => {
        if (e.keyCode === 13 && inputValue !== '') {
            setInputValue('')
            const res =  await addComment(localStorage.getItem('uid'), qid, inputValue )
            if(res.msg === 'success'){
                message.success('留言成功')
                comments.push({content: inputValue, time: "剛剛", _id: '', uid:{_id: localStorage.getItem("uid"), name: localStorage.getItem("name")}})
                setCounter(counter+1)
                localStorage.setItem("coin", res.user.coin)
                localStorage.setItem("xp", res.user.xp)
            }
            else {
                message.error('留言失敗')
            }
        }
    }

    const clickUserName = async(value) => {
        const res = await getUserProfile(value);
        if (res.msg === 'success') {
            setUser(res.user)
            setVisible(true)
        }
        else
            message.error('無法開啟檔案')
    }

    const catType = (category) => {
        switch(category) {
    
          case "life":   return "生活"
          case "relationship":  return "感情"
          case "academic": return "學術"
          case "leisure":   return "休閒"
          case "political" : return "政治"
          default:      return "其他"
        }
      }

    return(
        <div className='question-block'>
            <div className='question-title' style={{display:'flex', flexDirection:'row', alignItems:'baseline'}}>
                <span>
                    <h1 style={{marginTop:'-5px',marginBottom: '-5px'}}>{topic}</h1>
                </span>
                <h4 style={{color:'gray', marginLeft:'5px'}}>{timeCounter(time)}</h4>
            </div>
            <Button type="primary" size="small" className="login">{catType(category)}</Button>
            <div className='question-description'>
                {commentClicked?
                    <>
                        <h3 style={{marginTop:'20px'}}>{description}</h3>
                        <Button type='text' className='showMore' onClick={clickComment}>
                            收回
                        </Button>
                    </>:
                    <>
                        <Button type='text' className='showMore' onClick={clickComment}>
                            顯示更多
                        </Button>
                    </>
                }
            </div>
            <div className='comments'>
                {comments.length}個解答
                {
                    commentClicked?
                    <>
                        <div style={{display:'flex', flexDirection:'column'}}>
                            <div style={{display:'flex', flexDirection:'row', marginBottom: '5px'}}>
                                <Input type='text' style={{marginLeft:'5px', borderRadius:'10px'}} value={inputValue} onChange={handleChange} onKeyDown={(e) => sendComment(e)}/>
                            </div>
                            {
                                comments.map((comment) => 
                                    (<CommentBlock comment={comment} timeCounter={timeCounter} quid={quid} bestCommentId={bestCommentId} setBestCommentId={best} />))
                            }
                        </div>
                        <Divider orientation="right" plain>
                            <Button size='small' type="text" onClick={() => {clickUserName(quid);}} size='large'>{uid}</Button>
                            <UserForm visible={visible} onCancel={() => {setVisible(false);}} onOk={() => {setVisible(false)}} user={user}/>
                        </Divider>
                    </>
                    :
                    null
                }
            </div>

        </div>
    );
};

function CommentBlock({comment, timeCounter, quid, bestCommentId, setBestCommentId}) {
    const uid = comment.uid
    const content = comment.content
    const [user, setUser] = useState({});
    const [visible, setVisible] = useState(false);

    const clickUserName = async(value) => {
        const res = await getUserProfile(value);
        if (res.msg === 'success') {
            setUser(res.user)
            setVisible(true)
        }
        else
            message.error('無法開啟檔案')
    }

    return(
        <div className='comment'>
            <div style={{display: 'flex', flexDirection:'row', textAlign:'center'}}>
                <Button style={{marginLeft: '5px'}} size='small' type="text" onClick={() => {clickUserName(uid._id);}} size='large'>
                    {
                        comment._id === bestCommentId ?
                        <>
                            <FireTwoTone twoToneColor='#FF0000'/>
                        </> 
                        : 
                        null
                    }
                    {uid.name} 
                </Button>
                <UserForm visible={visible} onCancel={() => {setVisible(false);}} onOk={() => {setVisible(false)}} user={user}/>
                {
                    user._id !== localStorage.getItem("uid") && quid === localStorage.getItem("uid") && bestCommentId===undefined ?
                    <Button className='login' style={{position:'absolute', right:'15px'}} type="primary"  size='small' onClick={() => setBestCommentId(comment._id)} >
                        最佳留言
                    </Button> : null
                }
            </div>
            <h4 style={{marginLeft: '7px'}}>{content}</h4>
        </div>
    )
}
