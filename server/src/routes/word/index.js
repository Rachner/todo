const express = require('express')
const WordRouter = express.Router()

const Word = require("../../models/Word");

WordRouter.route('/(:word)?').get( async (req, res) => {
    let words = []
    const { word } = req.params
    const queries = word.split(',')
    // console.log(queries)

    if(word != "undefined" && word !== undefined){ // 사용자로부터 쿼리가 존재하는 경우
        console.log(queries)
        try{
            words = await Word.find({r_des: {$in: queries}})
            // words = await Word.find({r_word: word})
            // words = await Word.find({ r_word: { $regex: `^${word}`}}) // Word 모델의 r_word 필드에서 쿼리로 시작하는 단어 검색
            // words = await Word.find({ r_word: { $regex: `${word}$`}}) // Word 모델의 r_word 필드에서 쿼리로 끝나는 단어 검색
            // words = await Word.find({ r_des: { $regex: `${word}`}}) // Word 모델의 r_des 필드에서 쿼리를 포함하는 단어 검색
            words = await Word.find({ $or:
            [
                {r_word: {$regex: `${word}`}},
                {r_des: {$regex: `${word}`}}
            ]
        }).sort({"_id": -1})
        }catch(e){
            console.log(e)
        }
        
    }else{ // 쿼리가 없는 경우
        // words = await Word.find() // 전체 DB 조회
        console.log(word)
        console.log(`word database : ${Word}`)
        try{
            words = await Word.find()
        }catch(e){
            console.log(e)
        }
    }
    res.json({ status:200, words})
})

module.exports = WordRouter