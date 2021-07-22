import React from 'react'
import { Person } from './DataContainer'

interface Props {
  person: Person
  knows: Person[]
  known: Person[]
  onSelectPerson: (uri: string) => void
}

const PersonCard = ({ person, knows, known, onSelectPerson }: Props) => {
  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">
          <a href={person.uri}>{person.name || person.uri}</a>
        </p>
        <button
          className="card-header-icon"
          aria-label="close"
          onClick={() => onSelectPerson('')}
        >
          close
        </button>
      </header>
      {person.photo && (
        <div className="card-image">
          <figure className="image">
            <img src={person.photo} alt={person.name} />
          </figure>
        </div>
      )}
      <header className="card-header">
        <p className="card-header-title">knows: {knows.length}</p>
      </header>
      <section className="card-content">
        <ul className="buttons are-small">
          {knows.map(friend => (
            <li
              onClick={() => onSelectPerson(friend.uri)}
              key={friend.uri}
              className="button is-link"
            >
              {friend.name}
            </li>
          ))}
        </ul>
      </section>
      <header className="card-header">
        <p className="card-header-title">known by: {known.length}</p>
      </header>
      <section className="card-content">
        <ul className="buttons are-small">
          {known.map(friend => (
            <li
              onClick={() => onSelectPerson(friend.uri)}
              key={friend.uri}
              className="button is-link"
            >
              {friend.name}
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default PersonCard
