import {
  getSolidDataset,
  saveSolidDatasetAt,
  SolidDataset,
  UrlString,
  WithResourceInfo,
} from '@inrupt/solid-client'
import { useCallback } from 'react'
import { getSession } from '../session'
import useSwr, { responseInterface } from 'swr'

const session = getSession()
const fetcher = async (
  url: UrlString,
): Promise<SolidDataset & WithResourceInfo> => {
  const dataset = await getSolidDataset(url, { fetch: session.fetch })
  return dataset
}

type CachedDataset = responseInterface<
  SolidDataset & WithResourceInfo,
  unknown
> & { save: (dataset: SolidDataset & WithResourceInfo) => void }

export function useDataset(url: UrlString): CachedDataset
export function useDataset(url: null): null
export function useDataset(url: UrlString | null): CachedDataset | null
export function useDataset(url: UrlString | null): CachedDataset | null {
  const resourceUrl = url ? getResourceUrl(url) : null
  const result = useSwr(resourceUrl, fetcher)

  const update = useCallback(
    async (dataset: SolidDataset & WithResourceInfo) => {
      if (!resourceUrl) {
        return
      }

      // Optimistically update local view of the data
      result.mutate(dataset, false)
      const savedData = await saveSolidDatasetAt(resourceUrl, dataset, {
        fetch: session.fetch,
      })
      // Update local data with confirmed changes from the server,
      // then refetch to fetch potential changes performed in a different tab
      result.mutate(savedData, true)
    },
    [resourceUrl, result],
  )

  const cached: CachedDataset = {
    ...result,
    save: update,
  }

  return cached
}

function getResourceUrl(url: UrlString): UrlString {
  const resourceUrl = new URL(url)
  resourceUrl.hash = ''
  return resourceUrl.href
}
