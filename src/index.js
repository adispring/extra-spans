import * as R from 'ramda'
import {
  addStart,
  stringifySpans,
  ContentTypeInSpan,
  MessageType
} from './common'
import { splitLinks, transformLinkSpan } from './link'
import { splitAts, transformAtSpan, getOtherAtInfo } from './at'

const linkString =
  'hehttps://www.baidu.com?abc=1&cde=2he https://www.google.com?fgh=1&cde=2he'
const richTextString =
  'haha <at>id=108663445462&name=@王重阳</at> hehttps://www.baidu.com?abc=1&cde=2he<at>id=107958025341&name=@王鹏</at> 你好<at>id=953998689185147&name=@鸣人测试1</at> 所有：<at>id=-1&name=@所有人</at>'
const pureLinkString = 'https://www.google.com?abc=123&def=456'
// const links = splitLinks(linkString)
// console.log('links', links)

// const ats = splitAts(richTextString)
// console.log('ats', ats)

const { AT_USER, LINK } = ContentTypeInSpan

const { MESSAGE_TYPE_TEXT, MESSAGE_TYPE_LINK } = MessageType

const splitSpans = R.compose(
  addStart,
  R.chain(R.when(R.is(String), splitLinks)),
  splitAts
)

const transformSpans = R.curry((conversationId, all) =>
  R.compose(
    R.map(
      R.cond([
        [R.propEq('type', AT_USER), transformAtSpan(conversationId)],
        [R.propEq('type', LINK), transformLinkSpan],
        [R.T, R.identity]
      ])
    ),
    R.filter(R.is(Object))
  )(all)
)

const createMessageType = ({ spans = [], text = '' }) => {
  const messageType =
    spans.length === 1 &&
    R.pathEq([0, 'type'], LINK, spans) &&
    R.pathEq([0, 'length'], text.length, spans)
      ? MESSAGE_TYPE_LINK
      : MESSAGE_TYPE_TEXT
  return messageType
}

export const parseRichText = (conversationId, text) =>
  R.compose(
    R.ifElse(
      R.propEq('messageType', MESSAGE_TYPE_TEXT),
      R.converge(R.mergeRight, [R.identity, getOtherAtInfo]),
      R.evolve({ content: R.omit(['spans']) })
    ),
    R.applySpec({
      content: R.identity,
      messageType: createMessageType
    }),
    R.applySpec({
      spans: transformSpans(conversationId),
      text: stringifySpans
    }),
    splitSpans
  )(text)

// const spans = splitSpans(richTextString)
// console.log(spans)

const msgContent = parseRichText('666', richTextString)
console.log('msgContent', msgContent)
