// import Hammer from 'hammerjs'
import { TweenLite, TimelineLite } from 'gsap'
import VirtualScroll from 'virtual-scroll'

import { header } from './components'

import { wrap } from './utils'

import { snappy } from './easing'

import SplitText from './vendors/gsap/src/bonus-files-for-npm-users/SplitText'

import '../scss/app.scss'

const headerEl = document.querySelector('.header')
const carousel = document.querySelector('.carousel')
const list = carousel.querySelector('.carousel__slides')
const indicator = carousel.querySelector('.cursor')
const slides = carousel.querySelectorAll('.carousel__slide')
const headlines = carousel.querySelectorAll('[data-sfx-headline]')
const videoEl = document.querySelectorAll('.vid-el')

const headerHeight = headerEl.clientHeight
const windowHeight = window.innerHeight
const carouselSpace = windowHeight - headerHeight

let grabbed = false
let progressOnGrabStart = 0
let preventDrag = false
let thrown = false
let slideTimelines = []
let currentSlide = 0
let canScroll = false
const scrollThreshold = 15
let flag = false
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1
const finalSlide = slides.length - 1
const initialSlide = 0

const vs = new VirtualScroll()

const mouseIndicator = () => {
  const revertProps = () => {
    TweenLite.set(indicator, { clearProps: 'all' })
  }

  TweenLite.to(indicator, 0.7, {
    onComplete: revertProps,
    repeat: 9,
    y: 5,
    yoyo: true,
  })
}

const splitHeadlineText = () => {
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

    TweenLite.set(titleEl, {
      width: titleWidth,
    })

    const lines = titleEl.querySelectorAll('.line')
    const lineWrapper = document.createElement('div')

    lineWrapper.classList.add('line-wrapper')
    wrap(lines, lineWrapper)

    TweenLite.set(lines, {
      y: '100%',
    })

    TweenLite.set(titleEl, {
      autoAlpha: 1,
    })
  })
}

const resetProps = () => {
  grabbed = false
  canScroll = true
  flag = false
}

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

const setupTimelines = () => {
  slideTimelines = Array.from(slides).map(slide => {
    const headline = slide.querySelectorAll('.carousel__slide__content-title .line')
    const copy = slide.querySelectorAll('.carousel__slide__content-copy p')
    const links = slide.querySelectorAll('.carousel__slide__content-copy .cta')

    return {
      animateIn: animateIn(headline, copy, links),
      animateOut: animateOut(headline, copy, links),
      el: slide,
    }
  })
}

const updateAfterThrow = () => {
  let progress = slideTimelines[currentSlide].animateOut.progress()

  const threshold = progress / slideTimelines[currentSlide].animateOut.duration() * 100

  if (progress < 0) {
    progress = 0
  } else if (progress > 1) {
    progress = 1
  }

  // if scrolling slow or basically scrolled fast but a very short distance which it's progress is closer to the existing active slide instead of the new slide it was going towards
  if (Math.abs(threshold) < 30) {
    thrown = false

    console.log('reverse')

    slideTimelines[currentSlide].animateOut.reverse(progress)
  // if scrolling fast go to the next slide
  } else {
    thrown = false
    canScroll = false

    console.log('play')

    slideTimelines[currentSlide].animateOut.play(progress)
  }

  if (thrown && slideTimelines[currentSlide].animateOut.progress() !== slideTimelines[currentSlide].animateOut.duration()) {
    requestAnimationFrame(updateAfterThrow)
  }
}

// const Pan = new Hammer.Pan({
//   direction: Hammer.DIRECTION_ALL,
//   threshold: 0,
// })

// const panManager = new Hammer.Manager(list)

// panManager.add(Pan)

// const onPanStart = () => {
//   if (!preventDrag) {
//     grabbed = true
//     thrown = false
//
//     progressOnGrabStart = slideTimelines[currentSlide].animateOut.progress()
//   }
// }

// const onPanMove = e => {
//   if (grabbed) {
//     const scrollAmount = e.deltaY / carouselSpace
//     let progress = progressOnGrabStart - scrollAmount
//
//     if (progress < 0) {
//       progress = 0
//     } else if (progress > 1) {
//       progress = 1
//     }
//
//     slideTimelines[currentSlide].animateOut.progress(progress)
//   }
// }

// const onPanEnd = () => {
//   if (grabbed) {
//     thrown = true
//
//     updateAfterThrow()
//   }
// }

const prevSlide = (loop = false) => {
  const oldSlide = currentSlide

  if (loop) {
    currentSlide = finalSlide // last slide
  } else {
    currentSlide -= 1
  }

  slideTimelines[oldSlide].animateOut.play()

  setTimeout(() => {
    slideTimelines[currentSlide].animateIn.play()
  }, slideTimelines[oldSlide].animateOut.duration)
}

const nextSlide = (loop = false) => {
  const oldSlide = currentSlide

  if (loop) {
    currentSlide = 0 // first slide
  } else {
    currentSlide += 1
  }

  slideTimelines[oldSlide].animateOut.play()

  setTimeout(() => {
    TweenLite.to(slides[oldSlide], 0.6, {
      onComplete: () => {
        slides[oldSlide].classList.remove('carousel__slide--active')
        videoEl[oldSlide].pause()

        TweenLite.to(slides[currentSlide], 0.6, {
          onComplete: () => {
            slides[currentSlide].classList.add('carousel__slide--active')
            videoEl[currentSlide].play()
            slideTimelines[currentSlide].animateIn.play()
          },
          opacity: 1,
        })
      },
      opacity: 0,
    })
  }, slideTimelines[oldSlide].animateOut.duration)
}

const onScroll = e => {
  if (headerEl.classList.contains('header--open') || !canScroll) {
    return false
  }

  let scrollY = e.deltaY

  if (isFirefox) {
    scrollY *= 3
  } else if (isSafari) {
    scrollY *= 5
  }

  // scrolling down - prev slide - positive delta
  if (e.deltaY > 0) {
    if (scrollY >= scrollThreshold) {
      if (!flag) {
        canScroll = false
        flag = true
        if (currentSlide === initialSlide) {
          prevSlide(true) // go to last slide
        } else {
          prevSlide()
        }
      }
    }
  // scrolling up - next slide - negative delta
  } else {
    if (Math.abs(scrollY) >= scrollThreshold) {
      if (!flag) {
        canScroll = false
        flag = true
        if (currentSlide === finalSlide) {
          nextSlide(true) // go to first slide
        } else {
          nextSlide()
        }
      }
    }
  }

  return false
}

window.addEventListener(
  'load',
  () => {
    header()
    mouseIndicator()
    splitHeadlineText()
    setupTimelines()

    Array.from(slides).forEach((slide, i) => {
      TweenLite.set(slides[i], { opacity: 0 })
      slides[i].classList.remove('carousel__slide--active')
      videoEl[i].pause()
    })

    TweenLite.set(slides[currentSlide], { opacity: 1 })
    slides[currentSlide].classList.add('carousel__slide--active')
    videoEl[currentSlide].play()
    slideTimelines[currentSlide].animateIn.play()

    // panManager.on('panstart', onPanStart)
    // panManager.on('panstart panmove', onPanMove)
    // panManager.on('panend', onPanEnd)

    vs.on(onScroll)
  },
  false
)
