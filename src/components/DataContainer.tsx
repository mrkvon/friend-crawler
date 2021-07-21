import React, { createContext, useContext, useState, useEffect } from 'react'
import { SessionContext } from '../contexts/session'
import BFSFriends from '../data/BFSFriends'
import { IriString } from '@inrupt/solid-client'

export const PeopleContext = createContext<{ [uri: string]: Person }>({})

interface Props {
  children: React.ReactNode
}

export type Person = {
  uri: IriString
  name: string
  photo: string
  status: 'success' | 'error' | 'pending'
  knows: Set<IriString>
  known?: Set<IriString>
}

const DataContainer = ({ children }: Props) => {
  const [info] = useContext(SessionContext)
  const [people, setPeople] = useState<{ [uri: string]: Person }>({})

  useEffect(() => {
    // here we lookup people connected to us
    const timbl: Person = {
      uri: 'https://timbl.solidcommunity.net/profile/card#me',
      name: '',
      photo: '',
      status: 'pending',
      knows: new Set(),
    }

    const me: Person = {
      uri: info?.webId ?? '',
      name: '',
      status: 'pending',
      knows: new Set(),
      photo: '',
    }

    return BFSFriends([timbl, ...(info?.isLoggedIn ? [me] : [])], setPeople)
  }, [info])

  Object.values(people).forEach(({ uri, knows }) => {
    knows.forEach(k => {
      const person = people[k]
      person.known = person.known ?? new Set()
      person.known.add(uri)
    })
  })

  return (
    <PeopleContext.Provider value={people}>{children}</PeopleContext.Provider>
  )
}

export default DataContainer
