import { TweenMax } from 'gsap'

import { finalSlide, initialSlide, slides, videoEl } from '../'

const toTheEnd = (newSlide, oldSlide, slideTimelines) => {
  TweenMax.to(slides[newSlide], 0.6, {
    autoAlpha: 1,
    onComplete: () => {
      // hide all previous slides to show last slide on top
      Array.from(slides).forEach((slide, i) => {
        if (i !== newSlide) {
          TweenMax.set(slides[i], { autoAlpha: 0 })
        }
      })

      // clear the translateZ now that we're at the end again
      TweenMax.set(slides[newSlide], { clearProps: 'z' })

      // once the slide is faded out pause the video
      videoEl[oldSlide].pause()

      // animate in the new content
      slideTimelines[newSlide].animateIn.play(0)
      videoEl[newSlide].play()

      // prepare the first slide to fade in in case use goes forward again
      TweenMax.set(slides[initialSlide], { z: 3 })
    },
  })
}

const moveBackward = (newSlide, oldSlide, slideTimelines) => {
  TweenMax.to(slides[newSlide], 0.6, {
    autoAlpha: 1,
    onComplete: () => {
      TweenMax.set(slides[initialSlide], { clearProps: 'z' })

      // reset props of old slide since it's down stream in z-index
      TweenMax.set([slides[oldSlide], slides[newSlide]], { clearProps: 'all' })

      // pause the video for the faded out slide
      videoEl[oldSlide].pause()

      // now start the animations for content on the newly active slide
      slideTimelines[newSlide].animateIn.play(0)
      videoEl[newSlide].play()

      // while looping we want to set the last slide to be on top for
      // the cross fade effect to work
      if (newSlide === initialSlide) {
        // clear out the styles not that we're at the beginning
        TweenMax.set(slides, { clearProps: 'all' })

        // prepare the last slide to be on top but still hidden for now
        TweenMax.set(slides[finalSlide], { autoAlpha: 0, z: 3 })
      }
    },
  })
}

const prevSlide = (currentSlide, loop, oldSlide, slideTimelines) => {
  // if we're going back to the end we want the last slide to fade in
  // on top of the last slide to achieve the cross fade effect
  if (loop) {
    // fade new slide in now that the content has animated away
    toTheEnd(currentSlide, oldSlide, slideTimelines)
    // proceed normally with fading in the new slide on top of the old slide
  } else {
    // fade in the first slide on top of last slide
    moveBackward(currentSlide, oldSlide, slideTimelines)
  }
}

export default (currentSlide, loop, oldSlide, slideTimelines) => {
  // animate the current slides content out first
  slideTimelines[oldSlide].animateOut.play(0)

  // wait for the animation out to finish before moving forward
  setTimeout(
    prevSlide(currentSlide, loop, oldSlide, slideTimelines),
    slideTimelines[oldSlide].animateOut.duration
  )
}
