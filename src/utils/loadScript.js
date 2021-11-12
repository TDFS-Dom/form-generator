const callbacks = {}

/**
 * Tải một kịch bản từ xa
 * @param {String} src Một kịch bản từ xa
 * @param {Function} callback Gọi lại
 */
function loadScript(src, callback) {
  const existingScript = document.getElementById(src)
  const cb = callback || (() => {})
  if (!existingScript) {
    callbacks[src] = []
    const $script = document.createElement('script')
    $script.src = src
    $script.id = src
    $script.async = 1
    document.body.appendChild($script)
    const onEnd = 'onload' in $script ? stdOnEnd.bind($script) : ieOnEnd.bind($script)
    onEnd($script)
  }

  callbacks[src].push(cb)

  function stdOnEnd(script) {
    script.onload = () => {
      this.onerror = this.onload = null
      callbacks[src].forEach(item => {
        item(null, script)
      })
      delete callbacks[src]
    }
    script.onerror = () => {
      this.onerror = this.onload = null
      cb(new Error(`Failed to load ${src}`), script)
    }
  }

  function ieOnEnd(script) {
    script.onreadystatechange = () => {
      if (this.readyState !== 'complete' && this.readyState !== 'loaded') return
      this.onreadystatechange = null
      callbacks[src].forEach(item => {
        item(null, script)
      })
      delete callbacks[src]
    }
  }
}

/**
 * Thêm một tập hợp các tập lệnh từ xa theo thứ tự
 * @param {Array} list Một tập hợp các kịch bản từ xa
 * @param {Function} cb Gọi lại
 */
export function loadScriptQueue(list, cb) {
  const first = list.shift()
  list.length ? loadScript(first, () => loadScriptQueue(list, cb)) : loadScript(first, cb)
}

export default loadScript
