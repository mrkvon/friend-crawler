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
        <p className="card-header-title" style={{ overflowWrap: 'anywhere' }}>
          <span>
            <a href={person.uri}>{person.name || person.uri}</a>{' '}
            <span
              className={`tag is-${
                person.status === 'success'
                  ? 'success'
                  : person.status === 'error'
                  ? 'danger'
                  : 'light'
              }`}
            >
              {person.status}
            </span>
          </span>
        </p>
        <span className="card-header-icon">
          <button
            className="delete"
            aria-label="close"
            onClick={() => onSelectPerson('')}
          >
            close
          </button>
        </span>
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
