import * as R from 'ramda'
import {
  findAllMatches,
  ContentTypeInSpan,
  splitToBeAndNotToBes
} from './common'

const { AT_USER } = ContentTypeInSpan

const atRegex = /<at>id=[\d|-]+&name=@.+?<\/at>/g
const atIdNameRegex = /<at>id=([\d|-]+)&name=(@.+?)<\/at>/g

const atTransformer = R.applySpec({
  content: R.path([1]),
  displayContent: R.path([2]),
  length: R.path([2, 'length']), // 取 name length 作为 at Object 的 length，方便计算发送时 start 的值
  type: R.always(AT_USER)
})

export const findAllAtUnmatches = R.split(atRegex)
export const findAllAtMatches = findAllMatches(atIdNameRegex, atTransformer)

export const splitAts = splitToBeAndNotToBes(
  findAllAtMatches,
  findAllAtUnmatches
)

const createSchema = (conversationId, content) =>
  R.ifElse(
    R.equals('-1'),
    R.always(''),
    () => `rocket://user/profile?uid=${content}&con_id=${conversationId}`
  )(content)

export const transformAtSpan = R.curry((conversationId, span) =>
  R.compose(
    spanVal => ({
      ...spanVal,
      schema: createSchema(conversationId, spanVal.content)
    }),
    R.omit(['displayContent'])
  )(span)
)
