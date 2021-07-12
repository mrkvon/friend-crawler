import { getThing, setThing, Thing } from '@inrupt/solid-client'
import { useCallback } from 'react'
import { useSessionInfo } from './sessionInfo'
import { useDataset } from './dataset'

export function useProfile() {
  const [sessionInfo] = useSessionInfo()
  const profileDoc = useDataset(sessionInfo?.webId ?? null)

  const update = useCallback(
    (profile: Thing) => {
      if (!profileDoc?.data) return

      const updatedProfileDoc = setThing(profileDoc.data, profile)
      profileDoc.save(updatedProfileDoc)
    },
    [profileDoc],
  )

  if (
    profileDoc === null ||
    typeof profileDoc.data === 'undefined' ||
    typeof sessionInfo?.webId === 'undefined'
  )
    return null

  const profile = getThing(profileDoc.data, sessionInfo.webId)

  if (profile === null) return null

  return { data: profile, save: update }
}
