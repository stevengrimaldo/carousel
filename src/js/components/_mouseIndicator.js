import { TweenMax } from 'gsap'

import { indicator } from '../'

const resetProps = () => {
  TweenMax.set(indicator, { clearProps: 'all' })
}

export default () => {
  TweenMax.to(indicator, 0.7, {
    onComplete: resetProps,
    repeat: 9,
    y: 5,
    yoyo: true,
  })
}
