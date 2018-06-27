import { get } from './'

export default els => {
  const elem = [].slice.call(els)

  elem.forEach(el => {
    const that = el
    const parent = that.parentNode
    const id = that.getAttribute('id')
    const selector = that.getAttribute('class')
    const src = that.getAttribute('src')

    get(src, data => {
      const oParser = new DOMParser()
      const oDOM = oParser.parseFromString(data, 'image/svg+xml')
      const svgEl = oDOM.documentElement

      if (id) {
        svgEl.setAttribute('id', id)
      }

      if (selector) {
        svgEl.classList.add(selector)
      }

      svgEl.classList.add('replaced-svg')
      svgEl.removeAttribute('xmlns:a')

      parent.innerHTML = ''
      parent.appendChild(svgEl)
    })
  })
}
