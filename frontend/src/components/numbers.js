import Person from './person'

const Numbers = ({ persons, onClick }) => {

    return (
      <>
        {persons.map(({ name, number, id }) => {
          return (
            <Person
             key={name}
             name={name}
             number={number}
             onClick={onClick}
             id={id}
            />
          )
        })}
      </>
    )
}

export default Numbers
