require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()
const Note = require("./models/note")
const { response } = require("express")

const requestLogger = (req, res, next) => {
    console.log("Method: ", req.method)
    console.log("Path:   ", req.path)
    console.log("Body:   ", req.body)
    console.log("--------")
    next()
}

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use(requestLogger)

app.get("/", (req, res) => {
    res.send("<h1>Hello, I am Austin!</h1>")
})

app.get("/api/notes", (req, res) => {
    Note.find({}).then((notes) => {
        res.json(notes)
    })
})

app.get("/api/notes/:id", (req, res, next) => {
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

app.post("/api/notes", (req, res) => {
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

app.delete("/api/notes/:id", (req, res, next) => {
    Note.findByIdAndRemove(req.params.id)
        .then((result) => {
            res.status(204).end()
        })
        .catch((error) => next(error))
})

app.put("/api/notes/:id", (req, res, next) => {
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

const unknownEndpoint = (req, res) => {
    res.status(404).send({
        error: "unknown endpoint",
    })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error)
    if (error.name === "CastError") {
        return res.status(400).send({ error: "malformatted id" })
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
