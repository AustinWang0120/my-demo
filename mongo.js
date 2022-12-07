const mongoose = require("mongoose")

if (process.argv.length < 3) {
    console.log("Please provide enough information")
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://yyaustin:${password}@cluster0.t88vztx.mongodb.net/demo?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model("Note", noteSchema)

const newNote = new Note({
    content: "HTML is easy",
    date: new Date(),
    important: true,
})

// newNote.save().then((result) => {
//     console.log("note saved!")
//     mongoose.connection.close()
// })

Note.find({}).then((result) => {
    result.forEach((note) => {
        console.log(note)
    })
    mongoose.connection.close()
})
