import { TweenLite } from 'gsap'

import { wrap } from '../utils'

import { snappy } from '../easing'

import SplitText from '../vendors/gsap/src/bonus-files-for-npm-users/SplitText'

export default (el, slide, timeline) => {
  let textType

  const headlineText = el.textContent || el.innerText
  const slideCopy = slide.querySelector('.carousel__slide__content-copy p')
  const slideLinks = slide.querySelectorAll('.cta')

  if (headlineText.indexOf(' ') < 0) {
    textType = 'words'
  } else {
    textType = 'lines'
  }

  const mySplitText = new SplitText(el, {
    linesClass: 'line',
    type: textType,
    wordsClass: 'line',
  })

  const revert = () => {
    mySplitText.revert()
    TweenLite.set(el, { clearProps: 'width' })
  }

  const lines = el.querySelectorAll('.line')
  const lineWrapper = document.createElement('div')

  lineWrapper.classList.add('line-wrapper')
  wrap(lines, lineWrapper)

  TweenLite.set(el, {
    opacity: 1,
    width: el.offsetWidth,
  })

  timeline.add('anIn')

  timeline.staggerFromTo(
    lines,
    0.7,
    {
      y: '100%',
    },
    {
      ease: snappy,
      y: '0%',
    },
    0.1,
    'anIn',
    revert
  )

  if (slideCopy) {
    timeline.to(
      slideCopy,
      0.5,
      {
        ease: snappy,
        opacity: 1,
      },
      'anIn+=0.3'
    )
  }

  if (slideLinks[0]) {
    timeline.staggerFromTo(
      slideLinks,
      0.3,
      {
        opacity: 0,
      },
      {
        ease: snappy,
        opacity: 1,
      },
      0.05,
      'anIn+=0.3'
    )
  }
}
