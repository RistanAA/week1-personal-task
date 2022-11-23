const express = require('express');
const router = express.Router();
const Posts = require('../schemas/post')
const Comments = require('../schemas/comment')

router.post('/posts', async (req, res) => {
    const { postId, user, password, title, content } = req.body;
    const posts = await Posts.find({ postId })

    if (posts.length) {
        return res.status(400).json({
            success: false,
            errorMessage: 'The document already exists',
        })
    }

    const createPosts = await Posts.create({
        postId,
        user,
        password,
        title,
        content,
    })

    return res.json({
        posts: createPosts,
    })
})

router.get('/posts', async (req, res) => {
    const posts = await Posts.find({}, { postId: 1, user: 1, title: 1, createdAt: 1 }).sort({ createdAt: -1 })

    res.json({
        data: posts
    })
})

router.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const posts = await Posts.find({ postId: +id }, { postId: 1, user: 1, title: 1, createdAt: 1 })

    res.json({
        data: posts
    })
})

router.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, password } = req.body;
    const posts = await Posts.findOne({ postId: +id })

    if (posts.password == password) {
        await Posts.updateOne({ postId: +id }, { $set: { title } })

        res.json({
            result: 'success',
            status: true
        })
    }

    return res.status(400).json({
        success: false,
        errorMessage: 'No user access',
    })


})
router.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const { title, password } = req.body;
    const posts = await Posts.findOne({ postId: +id })

    if (posts.password == password) {
        await Posts.deleteOne({ postId: +id })

        res.json({
            result: 'success',
            status: true
        })
    }

    return res.status(400).json({
        success: false,
        errorMessage: 'No user access',
    })


})

// router.get('/comments/:postId', async (req, res) => {
//     const { postId } = req.params;
//     const post = await Posts.findOne({ postId: +postId })
//     if (post) {
//         const comments = await Comments.find({ _id: post.comments }, { user: 1, comments: 1 }).sort({ createdAt: -1 })

//         return res.json({
//             postTitle: post.title,
//             // comments: comments
//             comments: comments.map(item => item.user + " - " + item.comments)
//         })
//     }
//     return res.status(400).json({
//         status: false,
//         result: "Not Found"
//     })
// })
router.get('/comments/:postId', async (req, res) => {
    const { postId } = req.params;
    const post = await Posts.findOne({ postId: +postId })
    if (post) {
        const comments = await Comments.find({ postId: +postId }, { user: 1, comments: 1 }).sort({ createdAt: -1 })

        return res.json({
            postTitle: post.title,
            comments: comments
            // comments: comments.map(item =>item._id + " - " + item.user + " - " + item.comments)
        })
    }
    return res.status(400).json({
        status: false,
        result: "Not Found"
    })
})

router.put('/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    const { comments } = req.body;

    if(!comments){
        return res.status(400).json({errorMessage: "Please enter the comment content"})
    }

    const comment = await Comments.findOne({ _id: commentId })
    if (comment) {
        await Comments.updateOne({ _id: commentId }, { $set: { comments } })
        return res.json({
            status: true,
            result: "Update success"
        })
    }
    return res.status(400).json({
        status: false,
        result: "Not Found"
    })
})
// router.put('/comments/:commentId', async (req, res) => {
//     const { commentId } = req.params;
//     const { comments } = req.body;

//     const comment = await Comments.findOne({ _id: commentId })
//     if (comment) {
//         await Comments.updateOne({ _id: commentId }, { $set: { comments } })
//         return res.json({
//             status: true,
//             result: "Update success"
//         })
//     }
//     return res.status(400).json({
//         status: false,
//         result: "Not Found"
//     })
// })
router.delete('/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    await Comments.deleteOne({ _id: commentId })

    return res.json({
        status: true,
        result: "Delete success"
    })
})

router.post('/comments/:postId', async (req, res) => {
    const { postId } = req.params;
    const { user, password, comments } = req.body

    if(!comments){
        return res.status(400).json({errorMessage: "Please enter the comment content"})
    }

    const post = await Posts.findOne({ postId: +postId })

    const createComment = Comments.create({
        user, password, comments, postId
    })
    // const addComment = []
    if(createComment) {
        return res.json({
            success: true,
            createComment
        })
    }

    return res.status(400).json({
        success: false,
        errorMessage: 'Not Found',
    })

})
// router.post('/comments/:postId', async (req, res) => {
//     const { postId } = req.params;
//     const { user, password, comments } = req.body

//     if(!comments){
//         return res.status(400).json({errorMessage: "Please enter the comment content"})
//     }

//     const post = await Posts.findOne({ postId: +postId })

//     // const addComment = []

//     if (post) {
//         const createComment = Comments.create({
//             user, password, comments
//         })
//         const getComment = await Comments.findOne({}).sort({ createdAt: -1 })

//         // addComment.push(getComment.id)

//         if (createComment) {
//             await Posts.updateOne({ postId: +postId }, { $set: { comments: [ ...post.comments, getComment.id] } })
//         }
//         return res.json({
//             result: 'success',
//             status: true
//         })
//     }

//     return res.status(400).json({
//         success: false,
//         errorMessage: 'Not Found',
//     })

// })

module.exports = router;