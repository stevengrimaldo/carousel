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
    TweenLite.set(el, { clearProps: 'width', opacity: 0 })
  }

  const lines = el.querySelectorAll('.line')
  const lineWrapper = document.createElement('div')

  lineWrapper.classList.add('line-wrapper')
  wrap(lines, lineWrapper)

  TweenLite.set(el, { width: el.offsetWidth })

  timeline.add('anOut')

  timeline.staggerFromTo(
    lines,
    0.5,
    {
      y: '0%',
    },
    {
      ease: snappy,
      y: '100%',
    },
    0.1,
    'anOut',
    revert
  )

  if (slideCopy) {
    timeline.to(
      slideCopy,
      0.3,
      {
        autoAlpha: 0,
        ease: snappy,
      },
      'anOut+=0.1'
    )
  }

  if (slideLinks[0]) {
    timeline.staggerFromTo(
      slideLinks,
      0.1,
      {
        autoAlpha: 1,
      },
      {
        autoAlpha: 0,
        ease: snappy,
      },
      0.05,
      'anOut+=0.1'
    )
  }
}
