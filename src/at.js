import * as R from 'ramda'
import {
  renameKeys,
  findAllMatches,
  ContentTypeInSpan,
  splitToBeAndNotToBes
} from './common'

const { AT_USER } = ContentTypeInSpan

const atRegex = /<at>id=\d+&name=@.+?<\/at>/g
const atIdNameRegex = /<at>id=(\d+)&name=(@.+?)<\/at>/g

const atTransformer = R.applySpec({
  content: R.path([0]),
  id: R.path([1]),
  name: R.pathOr('', [2]),
  length: R.path([2, 'length']), // 取 name length 作为 at Object 的 length，方便计算发送时 start 的值
  type: R.always(AT_USER)
})

export const findAllAtUnmatches = R.split(atRegex)
export const findAllAtMatches = findAllMatches(atIdNameRegex, atTransformer)

export const splitAts = splitToBeAndNotToBes(
  findAllAtMatches,
  findAllAtUnmatches
)

const transformSpan = R.curry((conversationId, span) =>
  R.compose(
    renameKeys({ id: 'content' }),
    spanVal => ({
      ...spanVal,
      schema: `rocket://user/profile?uid=${spanVal.id}&con_id=${conversationId}`
    }),
    R.pick(['start', 'length', 'id', 'type'])
  )(span)
)

export const pickAndTransformAtSpans = (conversationId, all) =>
  R.compose(
    R.map(transformSpan(conversationId)),
    R.filter(R.propEq('type', AT_USER))
  )(all)
