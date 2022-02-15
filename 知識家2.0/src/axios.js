import axios from 'axios'

const instance = axios.create({ baseURL: 'http://localhost:4000/api' })

const login = async (values) => {
    try {
      const {
        data: { msg, mail, name, detail, birth, intro, xp, coin, uid }
      } = await instance.post('/login', {values})
      if (msg === 'success') {
          return({mail, name, birth, intro, xp, coin, uid})
      } else {
          console.log(detail)
          return('failure')
      }
    } catch (err) {
      console.log(err.message)
      return('failure')
    }
}

const signup = async (values) => {
    try {
      const {
        data: { msg, mail, name, detail }
      } = await instance.post('/signup', {values})
      if (msg === 'success') {
          return({mail, name})
      } else {
          console.log(detail)
          return('failure')
      }
    } catch (err) {
      console.log(err.message)
      return('failure')
    }
}

const uploadForm = async (values, uid) => {
  try {
    const {
      data: { msg, detail, user }
    } = await instance.post('/createQuestion', {values, uid})
    if (msg === 'success') {
        return({msg, user})
    } else {
        console.log(detail)
        return({msg})
    }
  } catch (err) {
    console.log(err.message)
    return({msg: 'failure'})
  }
}

const changeSettings = async (values, uid) => {
  try {
    const {
      data: { msg, detail }
    } = await instance.post('/changeIntro', {values, uid})
    if (msg === 'success') {
        return('success')
    } else {
        console.log(detail)
        return('failure')
    }
  } catch (err) {
    console.log(err.message)
    return('failure')
  }
}

const changePassword = async (values, uid) => {
  console.log(values)
  try {
    const {
      data: { msg, detail }
    } = await instance.post('/changePassword', {values, uid})
    if (msg === 'success') {
        return('success')
    } else {
        console.log(detail)
        return('failure')
    }
  } catch (err) {
    console.log(err.message)
    return('failure')
  }
}

const getQuestionByPage = async ( page) => {
  try {
    const {
      data: { msg, detail, questions, pages }
    } = await instance.get('/getQuestionByPage', { params: page })
    if (msg === 'success') {
        return({questions, pages})
    } else {
        console.log(detail)
        return('failure')
    }
  } catch (err) {
    console.log(err.message)
    return('failure')
  }
}

const getQuestionByUser = async ( uid,page ) => {
  try {
    const {
      data: { msg, detail, response, pages }
    } = await instance.get('/getQuestionByUser', {params: {uid, page}})
    if (msg === 'success') {
        return({response, pages})
    } else {
        console.log(detail)
        return('failure')
    }
  } catch (err) {
    console.log(err.message)
    return('failure')
  }
}
const getCommentByUser = async ( uid, page ) => {
  try {
    const {
      data: { msg, detail, response, pages }
    } = await instance.get('/getCommentByUser', {params: {uid, page}})
    if (msg === 'success') {
        return({response, pages})
    } else {
        console.log(detail)
        return('failure')
    }
  } catch (err) {
    console.log(err.message)
    return('failure')
  }
}

const addComment = async ( uid, qid, content ) => {
  try {
    const {
      data: { msg, detail, user }
    } = await instance.post('/addComment', {uid, qid, content})
    if (msg === 'success') {
        return({msg, user})
    } else {
        console.log(detail)
        return({msg})
    }
  } catch (err) {
    console.log(err.message)
    return({msg: 'failure'})
  }
}

const getQuestionByKeyword = async ( keyword, page) => {
  try {
    const {
      data: { msg, detail, questions, pages }
    } = await instance.get('/getQuestionByKeyword', { params: {keyword, page} })
    if (msg === 'success') {
        return({questions, pages})
    } else {
        console.log(detail)
        return('failure')
    }
  } catch (err) {
    console.log(err.message)
    return('failure')
  }
}

const setBestComment = async ( qid, cid ) => {
  try {
    const {
      data: { msg, detail, user }
    } = await instance.post('/setBestComment', {qid, cid})
    if (msg === 'success') {
        return({msg, user})
    } else {
        console.log(detail)
        return({msg})
    }
  } catch (err) {
    console.log(err.message)
    return({msg: 'failure'})
  }
}

const getUserProfile = async ( uid ) => {
  try {
    const {
      data: { msg, detail, user }
    } = await instance.get('/getUserProfile', { params: {uid} })
    if (msg === 'success') {
        return({msg, user})
    } else {
        console.log(detail)
        return({msg})
    }
  } catch (err) {
    console.log(err.message)
    return({msg: 'failure'})
  }
}

export { login, signup, uploadForm, changeSettings, changePassword, getQuestionByPage, getQuestionByUser, getCommentByUser, addComment, getQuestionByKeyword, setBestComment, getUserProfile }