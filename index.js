const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const jsonParser = bodyParser.json()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())

morgan.token('body', (res) => { return JSON.stringify(res.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

// app.get('/info', (req, res) => {
//   const date = new Date()
//   res.send(`<p>Phonebook has info for ${persons.length} people</p>
//             <p>${date}</p>`)
// })

app.get('/api/persons', (req, res) => {
  Person.find({}).then(people => {
    res.json(people)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person)
  })
})

// app.delete('/api/persons/:id', (req, res) => {
//   const id = Number(req.params.id)
//   persons = persons.filter(person => person.id !== id)

//   res.status(204).end()
// })

// const generateId = () => {
//   return Math.floor(Math.random() * 1000)
// }

app.post('/api/persons', jsonParser, (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'information missing'
    })
  }

  // if (persons.some(person => person.name === body.name)) {
  //   return res.status(400).json({
  //     error: 'name must be unique'
  //   })
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})