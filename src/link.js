import * as R from 'ramda'
import {
  findAllMatches,
  ContentTypeInSpan,
  splitToBeAndNotToBes
} from './common'

const { LINK } = ContentTypeInSpan

const LinkRegex = /https?:\/\/[\w|=|?|#|%|.|/|&|\-|,]+/g

const linkTransformer = R.applySpec({
  content: R.path([0]),
  length: R.path([0, 'length']),
  name: R.path([0]),
  type: R.always(LINK)
})

export const findAllLinkMatches = findAllMatches(LinkRegex, linkTransformer)
export const findAllLinkUnmatches = R.split(LinkRegex)

export const splitLinks = splitToBeAndNotToBes(
  findAllLinkMatches,
  findAllLinkUnmatches
)
