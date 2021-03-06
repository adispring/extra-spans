import * as R from 'ramda'
import {
  findAllMatches,
  ContentTypeInSpan,
  splitToBeAndNotToBes,
  renameKeys
} from './common'

const { LINK } = ContentTypeInSpan

const LinkRegex = /https?:\/\/[\w|=|?|#|%|.|/|&|\-|,]+/g

const linkTransformer = R.applySpec({
  content: R.always(''),
  displayContent: R.path([0]),
  schema: R.path([0]),
  length: R.path([0, 'length']),
  type: R.always(LINK)
})

export const findAllLinkMatches = findAllMatches(LinkRegex, linkTransformer)
export const findAllLinkUnmatches = R.split(LinkRegex)

export const splitLinks = splitToBeAndNotToBes(
  findAllLinkMatches,
  findAllLinkUnmatches
)

export const transformLinkSpan = R.omit(['displayContent'])
