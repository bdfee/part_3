const express = require('express')
const app = express()
var morgan = require('morgan')
require('dotenv').config()

// const cors = require('cors')
// app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('reqBody', (req) => {
  return JSON.stringify(req.body)
})

app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['reqBody'](req, res)
  ].join(' ')
}))

const Person = require('./models/person')

app.get('/', (request, response) => {
  response.send('<h1>hello world</h1>')
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({}).then(count => {
    response.send(`<div>phonebook has info for ${count} people</div>
      <div>${new Date().toString()}/div>`
    )
  }).catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({
      error: 'incomplete entry'
    })
  }

  Person.find({ name: name }).then(result => {

    if (result.length) {
      return response.status(400).json({
        error: `${name} already exists in database`
      })
    } else {
      const person = new Person({
        name: name,
        number: number
      })
      person.save().then(savedPerson => {
        response.json(savedPerson)
      }).catch(error => next(error))
    }
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body
  Person.findByIdAndUpdate(request.params.id,
    { number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(result => {
      if (result)
        response.json(result)
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  const { message, name } = error
  console.error('handler', message)

  if (name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (name === 'ValidationError') {
    return response.status(400).json({ error: message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT,() => {
  console.log(`Server running on port ${PORT}`)
})
