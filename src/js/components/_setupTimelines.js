import { TimelineLite } from 'gsap'

import { snappy } from '../easing'
import { resetProps } from '../'

const animateIn = (headline, copy, links) => {
  const inTimeline = new TimelineLite({
    onComplete: resetProps,
    paused: true,
  })

  inTimeline.add('anIn')

  inTimeline.staggerTo(
    headline,
    0.7,
    {
      ease: snappy,
      y: '0%',
    },
    0.1,
    'anIn'
  )

  if (copy[0]) {
    inTimeline.staggerTo(
      copy,
      0.5,
      {
        autoAlpha: 1,
        ease: snappy,
      },
      0.03,
      'anIn+=0.2'
    )
  }

  if (links[0]) {
    inTimeline.staggerTo(
      links,
      0.3,
      {
        autoAlpha: 1,
        ease: snappy,
      },
      0.05,
      'anIn+=0.4'
    )
  }

  return inTimeline
}

const animateOut = (headline, copy, links) => {
  const outTimeline = new TimelineLite({
    paused: true,
  })

  outTimeline.add('anOut')

  outTimeline.staggerTo(
    headline,
    0.7,
    {
      ease: snappy,
      y: '100%',
    },
    0.1,
    'anOut'
  )

  if (copy[0]) {
    outTimeline.staggerTo(
      copy,
      0.5,
      {
        autoAlpha: 0,
        ease: snappy,
      },
      0.03,
      'anOut+=0.2'
    )
  }

  if (links[0]) {
    outTimeline.staggerTo(
      links,
      0.3,
      {
        autoAlpha: 0,
        ease: snappy,
      },
      0.05,
      'anOut+=0.4'
    )
  }

  return outTimeline
}

export default slides => {
  const slideTimelines = Array.from(slides).map(slide => {
    const headline = slide.querySelectorAll(
      '.carousel__slide__content-title .line'
    )
    const copy = slide.querySelectorAll('.carousel__slide__content-copy p')
    const links = slide.querySelectorAll('.carousel__slide__content-copy .cta')

    return {
      animateIn: animateIn(headline, copy, links),
      animateOut: animateOut(headline, copy, links),
      el: slide,
    }
  })

  return slideTimelines
}
