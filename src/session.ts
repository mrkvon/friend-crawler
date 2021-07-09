import { Session } from '@inrupt/solid-client-authn-browser'

const session = new Session()

export function getSession() {
  return session
}
