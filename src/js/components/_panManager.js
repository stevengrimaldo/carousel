import Hammer from 'hammerjs'
const windowHeight = window.innerHeight
const slidesContainer = document.querySelector('.carousel__slides')
const headerEl = document.querySelector('.header')
const headerHeight = headerEl.clientHeight
const carouselSpace = windowHeight - headerHeight
let grabbed = false
let preventDrag = false
let thrown = false
let progressOnGrabStart = 0
let currentSlide = 0
let slideTimelines = []

// done
export const resetProps = () => {
  grabbed = false
  // can scroll now
}

const Pan = new Hammer.Pan({
  direction: Hammer.DIRECTION_ALL,
  threshold: 0,
})

const panManager = new Hammer.Manager(slidesContainer)

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
    // can scroll now

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

// initiate dragging capabilities
panManager.add(Pan)
panManager.on('panstart', onPanStart)
panManager.on('panstart panmove', onPanMove)
panManager.on('panend', onPanEnd)
