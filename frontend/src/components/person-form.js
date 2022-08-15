const PersonForm = ({ addPerson, newName, handleAddName, newNumber, handleAddNumber }) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleAddName} /><br />
        number: <input value={newNumber} onChange={handleAddNumber} />
      </div>
      <button type="submit" >add</button>
    </form>
  )
}

export default PersonForm
