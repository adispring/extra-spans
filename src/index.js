import * as R from 'ramda'
import { addStart } from './common'
import { splitLinks } from './link'
import { splitAts } from './at'

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

const spans = splitSpans(richTextString)
console.log(spans)

const stringifySpans = R.reduce(
  R.useWith(R.concat, [R.identity, R.when(R.is(Object), R.path(['name']))]),
  ''
)
