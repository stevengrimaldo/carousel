import { TweenMax } from 'gsap'

import { finalSlide, initialSlide, slides, videoEl } from '../'

const backToTheBeginning = (newSlide, oldSlide, slideTimelines) => {
  TweenMax.to(slides[newSlide], 0.6, {
    autoAlpha: 1,
    onComplete: () => {
      // pause the video for the faded out slide
      videoEl[oldSlide].pause()

      // now start the animations for content on the newly active slide
      slideTimelines[newSlide].animateIn.play(0)
      videoEl[newSlide].play()

      // clear out the styles set from the last cycle through the carousel
      TweenMax.set(slides, { clearProps: 'all' })

      // prepare the last slide to be on top but still hidden for now
      TweenMax.set(slides[finalSlide], { autoAlpha: 0, z: 3 })
    },
  })
}

const moveForward = (newSlide, oldSlide, slideTimelines) => {
  TweenMax.to(slides[oldSlide], 0.6, {
    autoAlpha: 0,
    onComplete: () => {
      // now that we're not immediately ready to go backwards in a loop
      // we can remove the properties set on the last slide and proceed normally
      TweenMax.set(slides[finalSlide], { clearProps: 'all' })

      // once the slide is faded out pause the video
      videoEl[oldSlide].pause()

      // animate in the new content
      slideTimelines[newSlide].animateIn.play(0)
      videoEl[newSlide].play()

      // while looping we want to set the beginning slide to be on top for
      // the cross fade effect to work
      if (newSlide === finalSlide) {
        // since the initial slide is the most top layer we only need to
        // set the translateZ and not bother hiding since it will be on top
        TweenMax.set(slides[initialSlide], { z: 3 })
      }
    },
  })
}

const nextSlide = (currentSlide, loop, oldSlide, slideTimelines) => {
  // if we're going back to the beginning we want the first slide to fade in
  // on top of the last slide to achieve the cross fade effect
  if (loop) {
    // fade in the first slide on top of the last slide
    backToTheBeginning(currentSlide, oldSlide, slideTimelines)
    // proceed normally with fading out out the current slide into the new slide
  } else {
    // fade current slide out now that the content has animated away
    moveForward(currentSlide, oldSlide, slideTimelines)
  }
}

export default (currentSlide, loop, oldSlide, slideTimelines) => {
  // animate the current slides content out first
  slideTimelines[oldSlide].animateOut.play(0)

  // wait for the animation out to finish before moving forward
  setTimeout(
    nextSlide(currentSlide, loop, oldSlide, slideTimelines),
    slideTimelines[oldSlide].animateOut.duration
  )
}
