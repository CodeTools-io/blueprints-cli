let queue = []

function log(...value) {
  queue = [...queue, ...value]

  return queue
}

log.warning = function (value) {
  queue = [...queue, `⚠️ ${value}`]
}

log.error = function (value) {
  throw new Error(`${value}`)
}

log.output = function () {
  if (process.env.NODE_ENV !== 'test') {
    console.log(queue.join('\n'))
  }
  return queue.join('\n')
}

log.clear = function () {
  queue = []
}

module.exports = log
