const express = require('express')
const app = express()

app.use(express.json())

let persons = 
[
  { 
    name: 'Arto Hellas', 
    number: '040-123456',
    id: 1
  },
  { 
    name: 'Ada Lovelace', 
    number: '39-44-5323523',
    id: 2
  },
  { 
    name: 'Dan Abramov', 
    number: '12-43-234345',
    id: 3
  },
  { 
    name: 'Mary Poppendieck', 
    number: '39-23-6423122',
    id: 4
  },
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person) 
  } else {
    res.status(404).end()
  }
})

app.get('/info', (req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  const info = `Phonebook has info for ${persons.length} \npeople ${new Date()}`
  res.end(info)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  // console.log('body.name: ', body.name);
  // console.log('persons: ', persons);
  const find = persons.filter(p => p.name === body.name)
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

  const randomId = Math.floor(Math.random() * Math.floor(10000))
  const person = req.body
  person.id = randomId
  persons = persons.concat(person)

  res.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})