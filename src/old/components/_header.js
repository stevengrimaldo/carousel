import { TweenLite } from 'gsap'

import { snappy } from '../easing'

const currentSelector = document.getElementsByClassName('header')

const bodyEl = document.body
const headerEl = document.querySelector('.header')
const navItems = headerEl.querySelectorAll('.header__nav li')
const mobileTrigger = headerEl.querySelector('.header__mobile-trigger')

const resetAll = () => {
  TweenLite.set(navItems, { clearProps: 'all' })
}

export default () => {
  if (currentSelector.length) {
    headerEl.classList.add('header--loaded')

    mobileTrigger.addEventListener(
      'click',
      () => {
        const activeSlideVideo = document.querySelector(
          '.carousel__slide--active video'
        )

        if (headerEl.classList.contains('header--open')) {
          bodyEl.style.overflow = ''
          headerEl.classList.remove('header--open')

          if (activeSlideVideo) {
            activeSlideVideo.play()
          }

          TweenLite.staggerTo(
            navItems,
            0.675,
            {
              ease: snappy,
              onComplete: resetAll,
              opacity: 0,
              x: -15,
            },
            0.05
          )
        } else {
          bodyEl.style.overflow = 'hidden'
          headerEl.classList.add('header--open')

          if (activeSlideVideo) {
            activeSlideVideo.pause()
          }

          TweenLite.staggerTo(
            navItems,
            0.675,
            {
              delay: 0.5,
              opacity: 1,
              x: 0,
            },
            0.05
          )
        }
      },
      false
    )
  }
}
