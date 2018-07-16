import { TweenMax } from 'gsap'

import { headlines } from '../'
import { wrap } from '../utils'

import SplitText from '../vendors/gsap/src/bonus-files-for-npm-users/SplitText'

export default () => {
  const titles = Array.from(headlines).map(headline => ({
    el: headline,
    width: headline.querySelector('h1').offsetWidth,
  }))

  // eslint-disable-next-line no-unused-vars
  const mySplitText = new SplitText(headlines, {
    linesClass: 'line',
    type: 'lines',
  })

  titles.forEach((title, i) => {
    const titleWidth = title.width
    const titleEl = title.el
    const lines = titleEl.querySelectorAll('.line')
    const lineWrapper = document.createElement('div')

    lineWrapper.classList.add('line-wrapper')

    wrap(lines, lineWrapper)

    TweenMax.set(titleEl, {
      width: titleWidth,
    })

    TweenMax.set(lines, {
      y: '100%',
    })

    TweenMax.set(titleEl, {
      autoAlpha: 1,
    })
  })
}
