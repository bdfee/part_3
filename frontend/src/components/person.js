const Person = ({ name, number, onClick, id }) => {
  return (
    <div key={name}> {name} {number}
      <button onClick={onClick} value={name} id={id}>delete</button>
    </div>
  )
}

export default Person
