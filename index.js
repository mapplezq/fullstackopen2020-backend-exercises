require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Contact = require('./models/contact')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

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

app.get('/api/persons', (req, res, next) => {
  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
  .catch(error => {
    next(error)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
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
    .catch(error => next(error))
})

app.get('/info', (req, res, next) => {
  // res.writeHead(200, { 'Content-Type': 'text/plain' });
  // const info = `Phonebook has info for ${persons.length} \npeople ${new Date()}`
  // res.end(info)

  Contact.find({}).then(contacts => {
    res.end(`Phonebook has info for ${contacts.length} \npeople ${new Date()}`)
  })
  .catch(error => {
    next(error)
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  // const id = Number(req.params.id)
  // persons = persons.filter(p => p.id !== id)

  Contact.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))

  // res.status(204).end()
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  // console.log('body.name: ', body.name);
  // console.log('persons: ', persons);

  // Contact.find({})
  //   .then(contacts => {
  //     const find = contacts.filter(c => c.name === body.name)
  //     // console.log('infd: ', find);
  //     if (!body.name) {
  //       return res.status(400).json({
  //         error: 'name must be unique'
  //       })
  //     } else if (!body.number) {
  //       return res.status(400).json({
  //         error: 'number cannot be missing'
  //       })
  //     } else if (find.length > 0) {
  //       return res.status(400).json({
  //         error: 'name has been already exist'
  //       })
  //     }

  //     // const person = req.body
  //     const contact = new Contact({
  //       name: req.body.name,
  //       number: req.body.number
  //     })

  //     contact.save().then(savedContact => {
  //       res.json(savedContact)
  //     })
  //     .catch(error => next(error))
  //   })
  //   .catch(error => next(error))

  const contact = new Contact({
    name: req.body.name,
    number: req.body.number
  })

  contact.save().then(savedContact => {
    res.json(savedContact)
  })
  .catch(error => next(error))

  // const randomId = Math.floor(Math.random() * Math.floor(10000))
  // const person = req.body
  // person.id = randomId
  // persons = persons.concat(person)
  // res.json(person)
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const contact = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true, runValidators: true })
    .then(updatedContact => {
      res.json(updatedContact)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

// const PORT = 3001
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})