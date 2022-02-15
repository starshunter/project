import QuestionBlock from './Block'
import { Pagination } from 'antd';
import { getQuestionByKeyword } from '../../axios';
import React,{ useState, useEffect } from 'react';

const QuestionByPage = ({keyword}) => {

    const [current, setCurrent] = useState(1);
    const [totalPage, setTotalPage] = useState(1)
    const [questions, setQuestion] = useState([])
    const getQuestions = async (keyword, page)=>{
        const res = await getQuestionByKeyword(keyword, page)
        setQuestion(res.questions)
        setTotalPage(res.pages)
    }
    // useEffect(() => {
    //     getQuestions(keyword, current)
    // }, [current]);
    useEffect(() => {
        setCurrent(1)
        getQuestions(keyword, current)
    }, [keyword]);
    useEffect(() => {
        getQuestions(keyword, current)
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

export default QuestionByPage;
