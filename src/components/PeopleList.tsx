import React, { useContext } from 'react'
import { PeopleContext, Person } from './DataContainer'

interface Props {
  people: { [uri: string]: Person }
}

export const PeopleList = ({ people, ...props }: Props) => (
  <div {...props}>
    <div>total: {Object.keys(people).length}</div>
    <div>
      pending:{' '}
      {
        Object.values(people).filter(person => person.status === 'pending')
          .length
      }
    </div>
    <div>
      success:{' '}
      {
        Object.values(people).filter(person => person.status === 'success')
          .length
      }
    </div>
    <div>
      error:{' '}
      {Object.values(people).filter(person => person.status === 'error').length}
    </div>
    <div>
      links:{' '}
      {
        Object.values(people)
          .map(person => Array.from(person.knows))
          .flat().length
      }
    </div>
  </div>
)

type ULProps = Partial<React.HTMLAttributes<HTMLUListElement>>

export const PeopleListContainer = (props: ULProps) => {
  const people = useContext(PeopleContext)
  return <PeopleList people={people} {...props} />
}
