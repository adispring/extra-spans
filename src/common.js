import * as R from 'ramda'

export const ContentTypeInSpan = {
  LINK: 0,
  AT_USER: 1
}

export const renameKeys = R.curry((keysMap, obj) =>
  R.reduce(
    (acc, key) => R.assoc(keysMap[key] || key, obj[key], acc),
    {},
    R.keys(obj)
  )
)

export const findAllMatches = R.curry((regex, matchTransformer, str) => {
  let matches = []
  let match
  while ((match = regex.exec(str)) !== null) {
    const transformedMatch = matchTransformer(match)
    matches.push(transformedMatch)
  }
  return matches
})

const joinUnmatchesAndmatches = (unmatches, matches) => {
  let all = []
  for (let i = 0; i < unmatches.length; i++) {
    all.push(unmatches[i])
    if (matches[i]) {
      all.push(matches[i])
    }
  }
  // split 出的数组，头、尾可能会有不必要的空字符串，所以要去掉
  if (all[0] === '') {
    all.shift()
  }
  if (R.last(all) === '') {
    all.pop()
  }
  return all
}

export const splitToBeAndNotToBes = R.curry(
  (pickMatches, pickUnmatches, text) => {
    const matches = pickMatches(text)
    const unmatches = pickUnmatches(text)
    const all = joinUnmatchesAndmatches(unmatches, matches)
    return all
  }
)

export const addStart = all => {
  let currentIndex = 0
  let allWithStarts = []
  for (let i = 0; i < all.length; i++) {
    allWithStarts[i] = R.when(
      R.is(Object),
      R.mergeLeft({ start: currentIndex })
    )(all[i])
    currentIndex += all[i].length
  }
  return allWithStarts
}
