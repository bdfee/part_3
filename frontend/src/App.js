import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'

import Filter from './components/filter'
import PersonForm from './components/person-form'
import Header from './components/header'
import Numbers from './components/numbers'
import Notification from './components/notification'
import './index.css'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState([])

  const getContacts = () => phonebookService.getAll().then(({ data }) => setPersons(data))

  useEffect(() => {
    getContacts()
  }, [])

  const clearInputs = () => {
    setNewName('')
    setNewNumber('')
  }

  const postNotification = (status, message) => {
    setNotification([status, message])
    setTimeout(() => setNotification([]), 3000)
  }

  const addPerson = e => {
    e.preventDefault()
    
    const filteredNames = persons.filter(({ name }) => (name === newName))

    if (!filteredNames.length && newName.length) {

      const newPerson = { name: newName, number: newNumber }

      phonebookService
        .create(newPerson)
        .then(({ data, status }) => {
          setPersons(persons.concat(data))
          postNotification(status, `Added ${newPerson.name}`)
        })
        .catch(error => {
          postNotification(error.response.status, error.response.data.error)
        })

    } else if (filteredNames.length === 1) {

      const { name, id } = filteredNames[0]

      const userConfirmation = window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`)
      
      if (userConfirmation) {
        const updatePerson = {
          name,
          number: newNumber,
          id
        }

        phonebookService.update(id, updatePerson).then(result => {

          const updatePersons = persons.map(person => {
            if (person.id === updatePerson.id) {
              person = updatePerson
            }
            return person
          })

          setPersons(updatePersons)

        }).catch(error => {
          postNotification(error.response.status, error.response.data.error)
        })
      }
    } 
  clearInputs()
}

  const handleAddName = e => setNewName(e.target.value)
  const handleAddNumber = e => setNewNumber(e.target.value)
  const handleSetSearch = e => setSearch(e.target.value)

  const handleRemove = e => {
    if (window.confirm(`delete ${e.target.value}?`)) {
      phonebookService
        .remove(e.target.id)
        .then(({ status }) => {
          if (status === 204) {
            postNotification(status, `successfully removed ${e.target.value}`)
            setPersons(persons.filter(({ id }) => id !== e.target.id))
          }
        })
        .catch((error) => {
          postNotification(error.response.status, `Information of ${e.target.value} has already been removed from the server`)
          setTimeout(() => getContacts(), 3000)
        })
    }
  }

  const filteredPersons = persons.filter(({ name }) =>
     name.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      {(!notification.length) ? null : <Notification notification={notification} />}
      <h1>phonebook</h1>
      filter shown with: <Filter search={search} handleSetSearch={handleSetSearch} />
      <Header title='add a new' />
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleAddName={handleAddName}
        newNumber={newNumber}
        handleAddNumber={handleAddNumber}
      />
      <Header title='numbers' />
      <Numbers persons={filteredPersons} onClick={handleRemove} />
    </>
  )
}

export default App