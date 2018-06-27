import { TweenMax } from 'gsap'

import { header } from './components'

import { linesUp } from './animations'

import '../scss/app.scss'

const carousel = document.querySelector('.carousel')
const slides = carousel.querySelectorAll('.carousel__slide')
const slideOne = slides[0]
const videoOneEl = slideOne.querySelector('.vid-el')
const indicator = carousel.querySelector('.cursor')

const revertProps = () => {
  TweenMax.set(indicator, { clearProps: 'all' })
}

// constant
const slideCount = slides.length
const windowHeight = document.documentElement.clientHeight || window.innerHeight
const slideMoveThreshold = 69

// changing
let sliding = 'stationary'
let startClientX = 0
let startPixelOffset = 0

// state
let pixelOffset = 0
let activeSlideIndex = 0

const slideEnd = () => {
  //  When user is moving the image
  if (sliding === 'moving') {
    // reset sliding
    sliding = 'stationary'
    startClientX = 0

    // Distance of slide.
    const deltaSlide = pixelOffset - startPixelOffset

    // Calculate which slide needs to be in view.
    let currentSlide = activeSlideIndex

    if (Math.abs(deltaSlide) > slideMoveThreshold) {
      currentSlide =
        pixelOffset < startPixelOffset
          ? activeSlideIndex + 1
          : activeSlideIndex - 1

      // Make sure that unexisting slides weren't selected.
      currentSlide = Math.min(Math.max(currentSlide, 0), slideCount - 1)
    }

    // Since our slides are in full viewport height, the offset can be
    // calculated according to that.
    // px based: currentSlide * -windowHeight
    activeSlideIndex = currentSlide
    pixelOffset = currentSlide * -windowHeight
  }
}

const slideMove = e => {
  let touchEvent = e

  e.preventDefault()

  // Distance of slide.
  const deltaSlide = touchEvent.clientY - startClientX

  // If sliding started moving for the first time and there was a distance.
  if (sliding === 'touched' && Math.abs(deltaSlide) >= 1) {
    // Set status to 'actually moving'
    sliding = 'moving'
    // Store current offset
    startPixelOffset = pixelOffset
  }

  //  When user is moving the image
  if (sliding === 'moving') {
    // Setting ratio to 1 means that the user slide is 1 pixel for every 1
    // pixel of mouse movement.
    let touchPixelRatio = 1

    // Check if the user doesn't slide out of boundaries
    if (
      (activeSlideIndex === 0 && touchEvent.clientY > startClientX) ||
      (activeSlideIndex === slideCount - 1 && touchEvent.clientY < startClientX)
    ) {
      // Setting ratio to 3 means the image will be moving by 3 pixels each
      // time the user moves it's pointer by 1 pixel. (Rubber-band effect)
      touchPixelRatio = 3
    }

    // Calculate move distance.
    pixelOffset = startPixelOffset + deltaSlide / touchPixelRatio
  }
}

const slideStart = e => {
  let touchEvent = e

  sliding = 'stationary'
  startClientX = 0

  // If sliding has not started yet then store the current touch position to
  // calculate the distance in the future.
  if (sliding === 'stationary') {
    // Status 1 = slide started.
    sliding = 'touched'
    startClientX = touchEvent.clientY
  }
}

window.addEventListener(
  'load',
  () => {
    header()
    videoOneEl.play()
    linesUp(slideOne).play()
    TweenMax.to(indicator, 0.7, {
      onComplete: revertProps,
      repeat: 9, // 5 cycles
      y: 5,
      yoyo: true,
    })

    carousel
      .querySelector('.carousel__slides')
      .addEventListener('mousedown', slideStart, false)
    carousel
      .querySelector('.carousel__slides')
      .addEventListener('mouseleave', slideEnd, false)
    carousel
      .querySelector('.carousel__slides')
      .addEventListener('mousemove', slideMove, false)
    carousel
      .querySelector('.carousel__slides')
      .addEventListener('mouseup', slideEnd, false)
  },
  false
)
