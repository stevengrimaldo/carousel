import VirtualScroll from 'virtual-scroll'
import { TweenMax } from 'gsap'
import Hammer from 'hammerjs'

import {
  header,
  mouseIndicator,
  setupTimelines,
  showNextSlide,
  showPrevSlide,
  splitHeadlineText,
} from './components'

import '../scss/app.scss'

const windowHeight = window.innerHeight
const headerEl = document.querySelector('.header')
const carousel = document.querySelector('.carousel')
const list = carousel.querySelector('.carousel__slides')

export const headlines = carousel.querySelectorAll('[data-sfx-headline]')
export const indicator = carousel.querySelector('.cursor')
export const videoEl = carousel.querySelectorAll('.vid-el')
export const slides = carousel.querySelectorAll('.carousel__slide')

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1

const headerHeight = headerEl.clientHeight
const carouselSpace = windowHeight - headerHeight
const scrollThreshold = 15

export const finalSlide = slides.length - 1
export const initialSlide = 0

let grabbed = false
let preventDrag = false
let thrown = false
let canScroll = false
let flag = false

let progressOnGrabStart = 0
let currentSlide = 0

let slideTimelines = []

const vs = new VirtualScroll()

const Pan = new Hammer.Pan({
  direction: Hammer.DIRECTION_ALL,
  threshold: 0,
})

const panManager = new Hammer.Manager(list)

const updateAfterThrow = () => {
  let progress = slideTimelines[currentSlide].animateOut.progress()

  const threshold =
    (progress / slideTimelines[currentSlide].animateOut.duration()) * 100

  if (progress < 0) {
    progress = 0
  } else if (progress > 1) {
    progress = 1
  }

  // if scrolling slow or basically scrolled fast but a very short distance
  // which it's progress is closer to the existing active slide instead of the
  // new slide it was going towards
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

  if (
    thrown &&
    slideTimelines[currentSlide].animateOut.progress() !==
      slideTimelines[currentSlide].animateOut.duration()
  ) {
    requestAnimationFrame(updateAfterThrow)
  }
}

const onPanStart = () => {
  if (!preventDrag) {
    grabbed = true
    thrown = false

    progressOnGrabStart = slideTimelines[currentSlide].animateOut.progress()
  }
}

const onPanMove = e => {
  if (grabbed) {
    const scrollAmount = e.deltaY / carouselSpace
    let progress = progressOnGrabStart - scrollAmount

    if (progress < 0) {
      progress = 0
    } else if (progress > 1) {
      progress = 1
    }

    slideTimelines[currentSlide].animateOut.progress(progress)
  }
}

const onPanEnd = () => {
  if (grabbed) {
    thrown = true

    updateAfterThrow()
  }
}

// done
export const resetProps = () => {
  grabbed = false
  canScroll = true
  flag = false
}

// done
const prevSlide = (loop = false) => {
  const oldSlide = currentSlide

  // determine if we're going back to the end or not
  if (loop) {
    currentSlide = finalSlide
    headerEl.classList.add('header--inverted')
  } else {
    currentSlide -= 1
    if (!headerEl.classList.contains('header--inverted')) {
      headerEl.classList.add('header--inverted')
    } else if (currentSlide === initialSlide) {
      headerEl.classList.remove('header--inverted')
    }
  }

  showPrevSlide(currentSlide, loop, oldSlide, slideTimelines)
}

// done
const nextSlide = (loop = false) => {
  const oldSlide = currentSlide

  // determine if we're going to the beginning or not
  if (loop) {
    currentSlide = initialSlide

    headerEl.classList.remove('header--inverted')
  } else {
    currentSlide += 1

    if (!headerEl.classList.contains('header--inverted')) {
      headerEl.classList.add('header--inverted')
    }
  }

  showNextSlide(currentSlide, loop, oldSlide, slideTimelines)
}

// done
const scrollController = (deltaY, scrollY) => {
  // scrolling down - prev slide - positive delta
  if (deltaY > 0) {
    if (scrollY >= scrollThreshold) {
      if (!flag) {
        canScroll = false
        flag = true

        if (currentSlide === initialSlide) {
          prevSlide(true) // go to the last slide
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
          nextSlide(true) // go to the first slide
        } else {
          nextSlide()
        }
      }
    }
  }
}

// done
const onScroll = e => {
  if (headerEl.classList.contains('header--open') || !canScroll) {
    return false
  }

  let scrollY = e.deltaY

  // handle browser differences between deltaY increments
  if (isFirefox) {
    scrollY *= 3
  } else if (isSafari) {
    scrollY *= 5
  }

  scrollController(e.deltaY, scrollY)
}

// done
window.addEventListener(
  'load',
  () => {
    // initiate the header functionality and intro animations
    header()

    // fire the scroll indicator animation
    mouseIndicator()

    // split all headline text so they can be animated
    splitHeadlineText()

    // prepare the animation timelines
    slideTimelines = setupTimelines(slides)

    // prepare the last slide to fade in incase we go backwards
    TweenMax.set(slides[finalSlide], { autoAlpha: 0, z: 3 })
    slideTimelines[currentSlide].animateIn.play()
    videoEl[currentSlide].play()

    // initiate scrolling capabilities
    vs.on(onScroll)

    // initiate dragging capabilities
    panManager.add(Pan)
    panManager.on('panstart', onPanStart)
    panManager.on('panstart panmove', onPanMove)
    panManager.on('panend', onPanEnd)
  },
  false
)
