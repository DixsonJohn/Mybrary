const express = require('express')
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')

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
        res.redirect(`author/${newAuthor.id}`)
    }catch{
        res.render('author/new', {
            author: author,
            errorMessage: 'Error Creating New Author'
        })
    }
})

router.get('/:id',async (req,res)=>{
    try{
        const author = await Author.findById(req.params.id)
        const books = await Book.find({author:author.id}).limit(6).exec()
        res.render('author/show',{
            author: author,
            booksByAuthor: books
        })
    }catch{
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req,res)=>{
    try{
        const author = await Author.findById(req.params.id)
        res.render('author/edit', { author: author })
    }catch{
        res.redirect('/author')
    }
})

router.put('/:id',async (req,res)=>{
    let author
    try{
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save()
        res.redirect(`/author/${author.id}`)
    }catch{
        if(author == null){
            res.redirect('/')
        }else{
            res.render('author/new', {
                author: author,
                errorMessage: 'Error Creating New Author'
            })
        }
    }
})

router.delete('/:id', async (req,res)=>{
    let author
    try{
        author = await Author.findById(req.params.id)
        await author.remove()
        res.redirect('/author/')
    }catch{
        if(author == null){
            res.redirect('/')
        }else{
            res.redirect(`author/${author.id}`)
        }
    }
})

module.exports = router