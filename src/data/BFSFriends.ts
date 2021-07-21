import { fetch } from '@inrupt/solid-client-authn-browser'
import {
  getSolidDataset,
  getTerm,
  getThing,
  getTermAll,
  IriString,
} from '@inrupt/solid-client'
import { foaf, vcard } from 'rdf-namespaces'
import { Person } from '../components/DataContainer'
import { RateLimiter } from 'limiter'

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 50 })

const limitedFetch: typeof fetch = async (...props) => {
  await limiter.removeTokens(1)
  return await fetch(...props)
}

export const findFriends = async (
  webId: IriString,
): Promise<{ name: string; friends: IriString[]; photo: string }> => {
  if (webId) {
    const dataset = await getSolidDataset(getResourceUrl(webId), {
      fetch: limitedFetch,
    })
    const person = getThing(dataset, webId)
    if (person) {
      const friends = getTermAll(person, foaf.knows).map(a => a.value)
      const name = getTerm(person, foaf.name)?.value ?? ''
      const photo = getTerm(person, vcard.hasPhoto)?.value ?? ''
      return { name, photo, friends }
    }
  }

  return { name: '', photo: '', friends: [] }
}

// We'll need to figure out how to stop this
export const BFSFriends = (
  initial: Person[],
  onChange: (people: { [uri: string]: Person }) => void,
): (() => void) => {
  console.log('start crawling')
  let running = true
  let people: { [uri: string]: Person } = Object.fromEntries(
    initial.map(({ uri, ...person }) => {
      uri = fixUri(uri)
      return [uri, { ...person, uri }]
    }),
  )
  onChange(people)
  ;(async () => {
    while (
      running &&
      Object.values(people)
        .map(person => person.status)
        .includes('pending')
    ) {
      // take all unvisited persons
      const unvisitedPersons = Object.values(people).filter(
        person => person.status === 'pending',
      )
      if (unvisitedPersons.length > 0) {
        await Promise.all(
          unvisitedPersons.map(async unvisitedPerson => {
            // fetch their friends
            try {
              const { name, photo, friends } = await findFriends(
                unvisitedPerson.uri,
              )
              const unvisited: Person = {
                ...unvisitedPerson,
                status: 'success',
                knows: new Set(friends.map(uri => fixUri(uri))),
                name,
                photo,
              }

              // add their friends
              const newlyFoundFriends = Object.fromEntries(
                friends
                  .map(
                    uri =>
                      [
                        fixUri(uri),
                        {
                          status: 'pending',
                          knows: new Set(),
                          name: '',
                          uri: fixUri(uri),
                        } as Person,
                      ] as [IriString, Person],
                  )
                  .filter(([uri]) => !Object.keys(people).includes(uri)),
              )

              people = {
                ...people,
                ...newlyFoundFriends,
                [unvisited.uri]: unvisited,
              }
            } catch (e) {
              // set their status to error
              people = {
                ...people,
                [unvisitedPerson.uri]: { ...unvisitedPerson, status: 'error' },
              }
            } finally {
              onChange({ ...people })
            }
          }),
        )
      } else break
    }
  })()
  return () => {
    console.log('stop crawling')
    running = false
  }
}

const getResourceUrl = (url: string): string => {
  const resourceUrl = new URL(url)
  resourceUrl.hash = ''
  return resourceUrl.href
}

const fixUri = (uri: IriString) => {
  const regex = /^(.+)\.solid.community(.*)$/
  const match = uri.match(regex)
  if (match) {
    const [, begin, end] = match
    uri = `${begin}.solidcommunity.net${end}`
  }

  return uri
}
export default BFSFriends
