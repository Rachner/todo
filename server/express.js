var express = require('express') // node_modules 내 express 관련 코드를 가져온다
var app = express() 
var cors = require('cors')
var logger = require('morgan')
var mongoose = require('mongoose')

app.set('case sensitive routing', true);

const CONNECT_URL = 'mongodb://localhost:27017/Jean'
mongoose.connect(CONNECT_URL, { // Mongo DB 서버 연결
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("mongodb connected ..."))
.catch(e => console.log(`failed to connect mongodb: ${e}`))
    
//app.use(cors(corsOptions)) // CORS 설정 
app.use(express.json()) // request body 파싱 
app.use(logger('tiny')) // Logger 설정 

app.get("/users/:userId([0-9]{4})", (req, res) => {
    console.log(req.params) 
    res.send(`user id ${req.params.userId} found successfully !`)
})

app.get(
    "/users/:name/comments",
    (req, res, next) => {
        if (req.params.name !== "syleemomo") {
            res.status(401).send("you are not authorized to this page !")
        }
        next()
    },
    (req, res) => {
        res.send("this is page to update your comments!") // 댓글 수정 페이지 보여주기
    }
)

const blockFirstUser = (req, res, next) => {
    if(req.params.name === "kim") {
        res.status(401).send("you are not authoerized to this page !")
    }
    next()
}


const blockSecondUser = (req, res, next) => {
    if(req.params.name === "park") {
        res.status(401).send("you are not authoerized to this page !")
    }
    next()
}

const allowThisUser = (req, res) => {
    res.send("you can see this home page !")
}

app.get("/home/users/:name", [
    blockFirstUser,
    blockSecondUser,
    allowThisUser
])

app.get("/hello", (req, res) => {
    res.send(`<html>
        <head></head>
        <body>
            <h1>Hello world !</h1>
            <input type='button' value='Submit'/>
        </body>
        </html>`)
})

app.get("/hello1", (req, res) => {
    res.json({ user: "syleemomo", msg: "hello !" })
})

//---------------------------------------------

app.post("/users", (req, res) => {
    console.log(req.body.newUser)
    // 데이터베이스에 새로운 사용자 생성
    res.json(`new user - ${req.body.newUser.name} created`)
})

app.put("/users/:id", (req, res) => {
    console.log(req.body.updateUserInfo)
    // 데이터베이스에서 id에 해당하는 사용자 정보 조회 후 업데이트
    res.send(
        `user ${req.params.id} updated iwth payload ${JSON.stringify(
            req.body.updateUserInfo.name
        )}!`
    )
})

app.delete("/users/:id", (req, res) =>{
    // 데이터베이스에서 id에 해당하는 사용자 조회 후 제거
    res.send(`user ${req.params.id} removed !`)
})

//------------------------------------------------

app.use( (req, res, next) => { // 사용자가 요청한 페이지가 없는 경우 에러처리
    res.status(404).send("Sorry can't find page") })
    
app.use( (err, req, res, next) => { // 서버 내부 오류 처리 
    console.error(err.stack) 
    res.status(500).send("something is broken on server !") })

app.listen(5000, () => { // 5000 포트로 서버 오픈
    console.log('server is running on port 5000 ...')
 })

