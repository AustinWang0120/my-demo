const notesRouter = require("express").Router()
const Note = require("../models/note")

notesRouter.get("/", (req, res) => {
    Note.find({}).then((notes) => {
        res.json(notes)
    })
})

notesRouter.get("/:id", (req, res, next) => {
    Note.findById(req.params.id)
        .then((note) => {
            if (note) {
                res.json(note)
            } else {
                res.status(404).end()
            }
        })
        .catch((error) => next(error))
})

notesRouter.post("/", (req, res) => {
    const body = req.body
    if (!body.content) {
        return res.status(400).json({
            error: "content missing",
        })
    } else {
        const newNote = new Note({
            content: body.content,
            date: new Date(),
            important: body.important || false,
        })
        newNote.save().then((savedNote) => {
            res.json(savedNote)
        })
    }
})

notesRouter.delete("/:id", (req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.status(204).end()
        })
        .catch((error) => next(error))
})

notesRouter.put("/:id", (req, res, next) => {
    const body = req.body
    const newNote = {
        content: body.content,
        important: body.important,
    }
    Note.findByIdAndUpdate(req.params.id, newNote, {
        new: true,
        runValidators: true,
        context: "query",
    })
        .then((updatedNote) => {
            res.json(updatedNote)
        })
        .catch((error) => next(error))
})

module.exports = notesRouter
