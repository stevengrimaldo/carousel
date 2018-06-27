import { TweenLite, TimelineLite } from 'gsap'

import { wrap } from '../utils'

import { snappy } from '../easing'

import SplitText from '../vendors/gsap/src/bonus-files-for-npm-users/SplitText'

export default slide => {
  const timeline = new TimelineLite({
    paused: true,
  })

  const el = slide.querySelector('[data-sfx-headline]')
  const slideCopy = slide.querySelectorAll('.carousel__slide__content-copy p')
  const slideLinks = slide.querySelectorAll('.cta')
  const elWidth = el.offsetWidth

  const mySplitText = new SplitText(el, {
    linesClass: 'line',
    type: 'lines',
  })

  const revert = () => {
    mySplitText.revert()
    TweenLite.set(el, { clearProps: 'width' })
  }

  const lines = el.querySelectorAll('.line')
  const lineWrapper = document.createElement('div')

  lineWrapper.classList.add('line-wrapper')
  wrap(lines, lineWrapper)

  timeline.set(el, {
    width: elWidth,
  })

  timeline.set(lines, {
    y: '100%',
  })

  timeline.set(el, {
    autoAlpha: 1,
  })

  timeline.add('anIn')

  timeline.staggerTo(
    lines,
    0.7,
    {
      ease: snappy,
      y: '0%',
    },
    0.1,
    'anIn',
    revert
  )

  if (slideCopy[0]) {
    timeline.staggerTo(
      slideCopy,
      0.5,
      {
        autoAlpha: 1,
        ease: snappy,
      },
      0.03,
      'anIn+=0.2'
    )
  }

  if (slideLinks[0]) {
    timeline.staggerTo(
      slideLinks,
      0.3,
      {
        autoAlpha: 1,
        ease: snappy,
      },
      0.05,
      'anIn+=0.4'
    )
  }

  return timeline
}
