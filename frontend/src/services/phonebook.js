/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios'
const baseUrl = '/api/persons'

const getAll = () => axios.get(baseUrl)

const create = newPerson => axios.post(baseUrl, newPerson)

const remove = id => axios.delete(`${baseUrl}/${id}`)

const update = (id, person) => axios.put(`${baseUrl}/${id}`, person)

export default {
  getAll,
  create,
  update,
  remove
}
