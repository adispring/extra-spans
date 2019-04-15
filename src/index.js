import * as R from 'ramda'
import { addStart, stringifySpans, ContentTypeInSpan } from './common'
import { splitLinks, transformLinkSpan } from './link'
import { splitAts, transformAtSpan } from './at'

const { AT_USER, LINK } = ContentTypeInSpan
const linkString =
  'hehttps://www.baidu.com?abc=1&cde=2he https://www.google.com?fgh=1&cde=2he'
const richTextString =
  'haha <at>id=108663445462&name=@王重阳</at> hehttps://www.baidu.com?abc=1&cde=2he<at>id=107958025341&name=@王鹏</at> 你好<at>id=953998689185147&name=@鸣人测试1</at>'

const links = splitLinks(linkString)
console.log('links', links)

const ats = splitAts(richTextString)
console.log('ats', ats)

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

const parseRichText = (conversationId, text) =>
  R.compose(
    R.applySpec({
      spans: transformSpans(conversationId),
      text: stringifySpans
    }),
    splitSpans
  )(text)

const spans = splitSpans(richTextString)
console.log(spans)

const businessContent = parseRichText('666', richTextString)
console.log('businessContent', businessContent)
