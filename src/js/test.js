import Hammer from 'hammerjs'

import { TweenMax, Linear, Power2, Power4 } from 'gsap'

import { header } from './components'

import '../scss/app.scss'

const list = document.querySelector('.fancy-slider__list')
const something = list.querySelectorAll('.fancy-slider-item')
const items = something.map(e => e)

let grabbed = false
let progressOnGrabStart = 0
let currentSlide = 0
let preventDrag = false
let thrown = false
let canScroll = true

let grabbEnd
let speed
let lastUpdateAfterThrow
let panSpeed
let throwTween
let tween
let interval

const period = 1 / (items.length + 1) * 2
let percentageTable = []

for (var e in items) {
  percentageTable[e] = {
    max: period / 2 * e + period,
    mid: period / 2 * e + period / 2,
    min: period / 2 * e,
  }
}

const itemsTweenCoords = percentageTable.map(e => e.mid)

const t = {
  value: 0,
}

tween = new TweenMax(t, 1, {
  ease: Linear.easeNone,
  onUpdate: () => {
    for (const t in items) {
      const i = percentageTable[t]
      const n = tween.progress() - i.min
      const o = i.max - i.min
      let r = n / o

      if (r < 0) {
        r = 0
      } else if (r > 1) {
        r = 1
      }

      items[t].tl.progress(r)
    }
  },
  value: 1,
}).pause()

const updateAfterThrow = () => {
  var t = Date.now()
  var i = t - lastUpdateAfterThrow
  var n = speed * i
  var o = n / window.innerHeight
  var r = o / items.length
  var s = tween.progress() - r

  if (s < 0 ? s = 0 : s > 1 && (s = 1), tween.progress(s), speed *= 0.88, Math.abs(speed) < 0.01) {
    thrown = false
    goTo(itemsTweenCoords.indexOf((0, u.closest)(tween.progress(), itemsTweenCoords)), 0.5, Power2.easeOut)
  } else if (t >= grabbEnd + 50) {
    thrown = false
    canScroll = false
    var a = 1000 * speed / window.innerHeight
    var l = a / items.length
    var c = {
      value: tween.progress(),
    }

    if (throwTween && throwTween.kill) {
      throwTween.kill()
    }

    throwTween = TweenMax.to(c, 1.33, {
      ease: Power4.easeOut,
      onComplete: () => {
        grabbed = false
        canScroll = true

        var t = (0, u.closest)(c.value, itemsTweenCoords)

        currentSlide = itemsTweenCoords.indexOf(t)

        tween.progress(t)

        if (timerPaused) {
          resumeTimerCountdown()
        } else if (interval && interval.restart) {
          interval.restart()
        }
      },
      onUpdate: () => {
        var t = c.value

        if (t < 0) {
          t = 0
        } else if (t > 1) {
          t = 1
        }

        tween.progress(t)
      },
      throwProps: {
        value: {
          end: itemsTweenCoords,
          velocity: -l,
        },
      },
    })
  }

  lastUpdateAfterThrow = t

  if (!toDestroy && thrown && 0 != speed) {
    requestAnimationFrame(updateAfterThrow)
  }
}

// get a reference to an element
const stage = document.getElementById('stage')

// create a recognizer
const Pan = new Hammer.Pan({
  direction: Hammer.DIRECTION_ALL,
  threshold: 0,
})

// create a manager for that element
const panManager = new Hammer.Manager(stage)
panManager.add(Pan)

const onPanStart = () => {
  if (!preventDrag) {
    grabbed = true
    thrown = false

    if (throwTween && throwTween.kill) {
      throwTween.kill()
    }

    progressOnGrabStart = tween.progress()
  }
}

const onPanMove = e => {
  if (grabbed) {
    const i = e.deltaY / window.innerHeight
    const n = i / items.length

    let o = progressOnGrabStart - n

    if (o < 0) {
      o = 0
    } else if (o > 1) {
      o = 1
    }

    panSpeed = e.velocityY

    tween.progress(o)
  }
}

const onPanEnd = () => {
  if (grabbed) {
    thrown = true
    speed = panSpeed
    grabbEnd = Date.now()
    lastUpdateAfterThrow = grabbEnd

    updateAfterThrow()
  }
}

panManager.on('panstart', onPanStart)
panManager.on('panstart panmove', onPanMove)
panManager.on('panend', onPanEnd)

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
