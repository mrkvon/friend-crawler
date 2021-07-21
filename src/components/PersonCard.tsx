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
    <div
      style={{
        position: 'fixed',
        width: '100%',
        top: '0',
        bottom: 0,
        pointerEvents: 'none',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <div className="columns mr-1 mt-6">
        <div className="column is-one-quarter is-offset-three-quarters">
          <div
            className="card"
            style={{ pointerEvents: 'all', overflowX: 'auto', width: '100%' }}
          >
            <header className="card-header">
              <a className="card-header-title" href={person.uri}>
                {person.name || person.uri}
              </a>
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
        </div>
      </div>
    </div>
  )
}

export default PersonCard
