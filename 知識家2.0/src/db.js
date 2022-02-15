// User
// id: ID!
// mail: String!
// name: String!
// password: String!
// birth: Data
// Intro: String

// Question
// id: ID!
// uid: ID!
// time: Time!
// category: String!
// topic: String!
// content: String!
// conmments:[Comment]

// Comment
// id: ID!
// uid: ID!
// content: String!

var users = [
    {
        id: '1',
        mail: 'abc@google.com',
        name: 'JC',
        password: 'hiuhoihu',
        birth: '',
        Intro: '閉嘴啦'
    },
    {
        id: '2',
        mail: 'abc@google.com',
        name: '吳禹辰',
        password: 'hiuhoihu',
        birth: '',
        Intro: 'Ruby Ruby Ruby Ruby'
    }
];

var questions = [
    {
        id: '1',
        topic: '第一題',
        uid: '2',
        time: '2021/06/21',
        category: '政治',
        content:'JC是台獨分子嗎',
        comments:['1','2']
    },
    {
        id: '2',
        topic: '第2題',
        uid: '1',
        time: '2021/06/21',
        category: '政治',
        content:'第二題',
        comments:['3']
    },
    {
        id: '3',
        topic: '第3題',
        uid: '2',
        time: '2021/06/21',
        category: '政治',
        content:'許義又怎麼那麼庫',
        comments:[]
    }
]

var comments= [
    {
        id: '1',
        uid: '1',
        content: '是'
    },
    {
        id: '2',
        uid: '2',
        content: '把你抓去勞改'
    },
    {
        id: '3',
        uid: '2',
        content: '模降'
    },
]

var db = {
    users,
    questions,
    comments
}
export { db as default };