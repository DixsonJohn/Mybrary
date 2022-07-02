const express = require('express')
const router = express.Router()
const Author = require('../models/author')

// all author route
router.get('/',async (req,res)=>{
    let searchOptions = {}
    if(req.query.name != null && req.query.name !== ''){
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try{
        const author = await Author.find(searchOptions)
        res.render('author/index',{
            author:author,
            searchOptions: req.query
        })
    }catch{
        res.redirect('/')
    }
})

// new author route
router.get('/new',(req,res)=>{
    res.render('author/new', { author: new Author() })
})

// create author
router.post('/',async (req,res)=>{
    const author = new Author({
        name:req.body.name
    })
    try{
        const newAuthor = await author.save()
        //res.redirect(`author/${newAuthor.id}`)
        res.redirect(`author`)
    }catch{
        res.render('author/new', {
            author: author,
            errorMessage: 'Error Creating New Author'
        })
    }
    /*author.save((err, newAuthor)=>{
        if(err){
            res.render('author/new', {
                author: author,
                errorMessage: 'Error Creating New Author'
            })
        }else{
            res.redirect(`author/${newAuthor}`)
            res.redirect(`author`)
        }
    })*/
})

module.exports = router