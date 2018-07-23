import VirtualScroll from 'virtual-scroll'
import { TweenMax } from 'gsap'

import {
  mobileMenu,
  mouseIndicator,
  setupTimelines,
  showNextSlide,
  showPrevSlide,
  splitHeadlineText,
} from './components'

import '../scss/app.scss'

const headerEl = document.querySelector('.header')
const carousel = document.querySelector('.carousel')
const mobileTrigger = headerEl.querySelector('.header__mobile-trigger')

export const headlines = carousel.querySelectorAll('[data-sfx-headline]')
export const indicator = carousel.querySelector('.cursor')
export const videoEl = carousel.querySelectorAll('.vid-el')
export const slides = carousel.querySelectorAll('.carousel__slide')

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
const isSafari = navigator.userAgent.toLowerCase().indexOf('safari') > -1

const scrollThreshold = 15

export const finalSlide = slides.length - 1
export const initialSlide = 0

let canScroll = false
let flag = false

let currentSlide = 0

let slideTimelines = []

const vs = new VirtualScroll()

// done
export const resetProps = () => {
  // can grab now
  canScroll = true
  flag = false
}

// done
const prevSlide = () => {
  const oldSlide = currentSlide
  const loop = oldSlide === initialSlide

  // determine if we're going back to the end or not
  if (loop) {
    // go to the last slide
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
const nextSlide = () => {
  const oldSlide = currentSlide
  const loop = oldSlide === finalSlide

  // determine if we're going to the beginning or not
  if (loop) {
    // go to the first slide
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
    if (scrollY >= scrollThreshold && !flag) {
      canScroll = false
      flag = true

      prevSlide()
    }
    // scrolling up - next slide - negative delta
  } else {
    if (Math.abs(scrollY) >= scrollThreshold && !flag) {
      canScroll = false
      flag = true

      nextSlide()
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
    headerEl.classList.add('header--loaded')

    mobileTrigger.addEventListener(
      'click',
      () => mobileMenu(currentSlide),
      false
    )

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
  },
  false
)
