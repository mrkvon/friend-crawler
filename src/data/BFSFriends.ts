import { fetch } from '@inrupt/solid-client-authn-browser'
import {
  getSolidDataset,
  getTerm,
  getThing,
  getTermAll,
  IriString,
  SolidDataset,
} from '@inrupt/solid-client'
import { foaf, vcard, owl, rdfs } from 'rdf-namespaces'
import { Person } from '../components/DataContainer'
import { RateLimiter } from 'limiter'

const limiter = new RateLimiter({ tokensPerInterval: 1, interval: 50 })

/**
 * https://dmitripavlutin.com/timeout-fetch-request/#2-timeout-a-fetch-request
 */
const fetchWithTimeout: (timeout: number) => typeof fetch =
  (timeout: number) => async (resource, options) => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)

    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(id)

    return response
  }

const limitedFetch: typeof fetch = async (...props) => {
  await limiter.removeTokens(1)
  return await fetchWithTimeout(8000)(...props)
}

interface PersonData {
  name: string
  friends: IriString[]
  photo: IriString
}

/**
 * Fetch all profile documents connected to the webId by owl:sameAs or rdfs.seeAlso
 */
const findFullPersonProfile = async (
  webId: IriString,
  visited = new Set<IriString>(),
  response: SolidDataset[] = [],
  fail = true,
  iri = webId,
): Promise<SolidDataset[]> => {
  try {
    /* uncomment if it is annoying when the below profile blocks
    if (webId === 'https://ruben.verborgh.org/profile/#me') {
      throw new Error('a blocking profile')
    }
    // */
    visited.add(iri)
    const dataset = await getSolidDataset(iri, { fetch: limitedFetch })
    const person = getThing(dataset, webId)
    if (person) {
      response.push(dataset)
      const same: string[] = getTermAll(person, owl.sameAs).map(a => a.value)
      const see: string[] = getTermAll(person, rdfs.seeAlso).map(a => a.value)

      for (const uri of [...same, ...see]) {
        console.log('extending', uri)
        if (!visited.has(uri))
          await findFullPersonProfile(webId, visited, response, false, uri)
      }
    }
  } catch (e) {
    if (fail) throw e
  }
  return response
}

export const findFriends = async (webId: IriString): Promise<PersonData> => {
  const data: PersonData = { name: '', photo: '', friends: [] }
  if (webId) {
    const dataset = await findFullPersonProfile(webId)
    dataset.reduce((data, d) => {
      const person = getThing(d, webId)
      if (person) {
        const friends = getTermAll(person, foaf.knows).map(a => a.value)
        data.friends = data.friends
          .concat(friends)
          .filter((a, i, data) => data.indexOf(a) === i)
        if (!data.name)
          data.name =
            getTerm(person, foaf.name)?.value ??
            getTerm(person, vcard.fn)?.value ??
            ''
        if (!data.photo)
          data.photo =
            getTerm(person, vcard.hasPhoto)?.value ??
            getTerm(person, foaf.img)?.value ??
            ''
      }
      return data
    }, data)
    return data
  }

  return data
}

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

/*
const getResourceUrl = (url: string): string => {
  const resourceUrl = new URL(url)
  resourceUrl.hash = ''
  return resourceUrl.href
}
*/

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
