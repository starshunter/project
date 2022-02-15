import QuestionBlock from './Block'
import { getCommentByUser} from '../../axios';
import React,{ useState, useEffect } from 'react';
import { Pagination } from 'antd';

const CommentByUser = () => {
    const [current, setCurrent] = useState(1);
    const [totalPage, setTotalPage] = useState(1)
    const [questions, setQuestion] = useState([])
    const getQuestions = async (user, page)=>{
        const res = await getCommentByUser(user, page)
        setQuestion(res.response)
        setTotalPage(res.pages)
    }
    useEffect(() => {
        getQuestions(localStorage.getItem("uid"), current)
    }, [current]);
    
    return(
        <>
            {questions.length !== 0?
                <>
                    {Object.values(questions).map((item) => <QuestionBlock  question={item} />)}
                    <Pagination current={current} onChange={(page)=> setCurrent(page)} total={totalPage} pageSize={1}/>
                </>
                 :
                <h1>目前沒有文章</h1>
            }
            
        </>
    )
}

export default CommentByUser;