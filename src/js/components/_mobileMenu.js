import { TweenMax } from 'gsap'

import { snappy } from '../easing'
import { slides } from '../'

const bodyEl = document.body
const headerEl = document.querySelector('.header')
const navItems = headerEl.querySelectorAll('.header__nav li')

const resetAll = () => {
  TweenMax.set(navItems, { clearProps: 'all' })
}

export default currentSlide => {
  // grab the active video when the menu is opened
  const activeSlideVideo = slides[currentSlide].querySelector('.vid-el')

  // if the menu is open we prepare to close it with some animations
  if (headerEl.classList.contains('header--open')) {
    bodyEl.style.overflow = ''
    headerEl.classList.remove('header--open')

    if (activeSlideVideo) {
      activeSlideVideo.play()
    }

    TweenMax.staggerTo(
      navItems,
      0.675,
      {
        autoAlpha: 0,
        ease: snappy,
        onComplete: resetAll,
        x: -15,
      },
      0.05
    )
    // if the menu is closed we open it
  } else {
    bodyEl.style.overflow = 'hidden'
    headerEl.classList.add('header--open')

    if (activeSlideVideo) {
      activeSlideVideo.pause()
    }

    TweenMax.staggerTo(
      navItems,
      0.675,
      {
        autoAlpha: 1,
        delay: 0.5,
        x: 0,
      },
      0.05
    )
  }
}
