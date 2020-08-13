require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Contact = require('./models/contact')
const app = express()

app.use(cors())
app.use(express.json())

// app.use(morgan('tiny'))
morgan.token('body', function getBody (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

// let persons = 
// [
//   { 
//     name: 'Arto Hellas', 
//     number: '040-123456',
//     id: 1
//   },
//   { 
//     name: 'Ada Lovelace', 
//     number: '39-44-5323523',
//     id: 2
//   },
//   { 
//     name: 'Dan Abramov', 
//     number: '12-43-234345',
//     id: 3
//   },
//   { 
//     name: 'Mary Poppendieck', 
//     number: '39-23-6423122',
//     id: 4
//   },
// ]

app.get('/api/persons', (req, res) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
})

app.get('/api/persons/:id', (req, res) => {
  // const id = Number(req.params.id)
  // const person = persons.find(person => person.id === id)

  Contact.findById(req.params.id)
    .then(contact => {
      if (contact) {
        res.json(contact) 
      } else {
        res.status(404).end()
      }
    })
})

app.get('/info', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  const info = `Phonebook has info for ${persons.length} \npeople ${new Date()}`
  res.end(info)
})

app.delete('/api/persons/:id', (req, res) => {
  // const id = Number(req.params.id)
  // persons = persons.filter(p => p.id !== id)

  Contact.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })

  // res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  // console.log('body.name: ', body.name);
  // console.log('persons: ', persons);

  Contact.find({})
    .then(contacts => {
      const find = contacts.filter(c => c.name === body.name)
      // console.log('infd: ', find);
      if (!body.name) {
        return res.status(400).json({
          error: 'name must be unique'
        })
      } else if (!body.number) {
        return res.status(400).json({
          error: 'number cannot be missing'
        })
      } else if ( find.length > 0) {
        return res.status(400).json({
          error: 'name has been already exist'
        })
      }

      // const person = req.body
      const contact = new Contact({
        name: req.body.name,
        number: req.body.number
      })

      contact.save().then(savedContact => {
        res.json(savedContact)
      })
    })
  // const randomId = Math.floor(Math.random() * Math.floor(10000))
  // const person = req.body
  // person.id = randomId
  // persons = persons.concat(person)
  // res.json(person)
})


// const PORT = 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})