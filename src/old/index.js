import { TimelineLite } from 'gsap'

import { header } from './components'

import { linesUp } from './animations'

import '../scss/app.scss'

// Slide One
import spriteOne from '../media/vid/video-sprite-one.jpg'
import videoOneMp4 from '../media/vid/video-one.mp4'
import videoOneWebm from '../media/vid/video-one.webm'

// Slide Two
import spriteTwo from '../media/vid/video-sprite-two.jpg'
import videoTwoMp4 from '../media/vid/video-two.mp4'
import videoTwoWebm from '../media/vid/video-two.webm'

// Slide Three
import spriteThree from '../media/vid/video-sprite-three.jpg'
import videoThreeMp4 from '../media/vid/video-three.mp4'
import videoThreeWebm from '../media/vid/video-three.webm'

// Slide Four
import spriteFour from '../media/vid/video-sprite-four.jpg'
import videoFourMp4 from '../media/vid/video-four.mp4'
import videoFourWebm from '../media/vid/video-four.webm'

// Slide Five
import spriteFive from '../media/vid/video-sprite-five.jpg'
import videoFiveMp4 from '../media/vid/video-five.mp4'
import videoFiveWebm from '../media/vid/video-five.webm'

const slides = [
  {
    active: true,
    bgColor: '#ffffff',
    color: '#111111',
    video: {
      files: [
        {
          src: videoOneMp4,
          type: 'mp4',
        },
        {
          src: videoOneWebm,
          type: 'webm',
        },
      ],
      poster: spriteOne,
      ready: false,
      scale: 0,
    },
  },
  {
    active: false,
    bgColor: '#455560',
    color: '#ffffff',
    video: {
      files: [
        {
          src: videoTwoMp4,
          type: 'mp4',
        },
        {
          src: videoTwoWebm,
          type: 'webm',
        },
      ],
      poster: spriteTwo,
      ready: false,
      scale: 0,
    },
  },
  {
    active: false,
    bgColor: '#a5c9c7',
    color: '#ffffff',
    video: {
      files: [
        {
          src: videoThreeMp4,
          type: 'mp4',
        },
        {
          src: videoThreeWebm,
          type: 'webm',
        },
      ],
      poster: spriteThree,
      ready: false,
      scale: 0,
    },
  },
  {
    active: false,
    bgColor: '#df2927',
    color: '#ffffff',
    video: {
      files: [
        {
          src: videoFourMp4,
          type: 'mp4',
        },
        {
          src: videoFourWebm,
          type: 'webm',
        },
      ],
      poster: spriteFour,
      ready: false,
      scale: 0,
    },
  },
  {
    active: false,
    bgColor: '#d24627',
    color: '#ffffff',
    video: {
      files: [
        {
          src: videoFiveMp4,
          type: 'mp4',
        },
        {
          src: videoFiveWebm,
          type: 'webm',
        },
      ],
      poster: spriteFive,
      ready: false,
      scale: 0,
    },
  },
]

const scope = document.querySelector('.carousel')
const slideOne = scope.querySelector('.carousel__slide--one')
const slideOneHeadline = slideOne.querySelector('[data-sfx-headline]')
const canvas = scope.querySelectorAll('.vid-canvas')

let currentSlideIndex = 0
let flag = false

const resetFlag = () => {
  flag = false
}

const inTimeline = new TimelineLite({
  onComplete: resetFlag,
})

export const updateCanvas = () => {
  slides[currentSlideIndex].video.ctx.clearRect(
    0,
    0,
    canvas[currentSlideIndex].width,
    canvas[currentSlideIndex].height
  )
  slides[currentSlideIndex].video.ctx.drawImage(
    slides[currentSlideIndex].video.el,
    slides[currentSlideIndex].video.left,
    slides[currentSlideIndex].video.top,
    slides[currentSlideIndex].video.newWidth,
    slides[currentSlideIndex].video.newHeight
  )
  slides[currentSlideIndex].video.ctx.globalCompositeOperation = 'multiply'
  slides[currentSlideIndex].video.ctx.fillStyle =
    slides[currentSlideIndex].bgColor
  slides[currentSlideIndex].video.ctx.beginPath()
  slides[currentSlideIndex].video.ctx.arc(
    slides[currentSlideIndex].video.newWidth / 2,
    slides[currentSlideIndex].video.newHeight / 2,
    slides[currentSlideIndex].video.newWidth,
    slides[currentSlideIndex].video.newHeight,
    Math.PI * 2,
    false
  )
  slides[currentSlideIndex].video.ctx.closePath()
  slides[currentSlideIndex].video.ctx.fill()

  requestAnimationFrame(updateCanvas)
}

const loadVideo = (slide, i) => {
  const vid = slide.video
  // create a video element
  const videoEl = document.createElement('video')
  // add the video sources
  vid.files.forEach((file, i) => {
    const videoSrc = document.createElement('source')
    videoSrc.src = file.src
    videoSrc.type = `video/${file.type}`
    videoEl.appendChild(videoSrc)
  })
  // the video will now begin to load.
  videoEl.poster = vid.poster
  // ensure that the video does not auto play
  videoEl.autoplay = false
  // set the video to loop
  videoEl.loop = true
  // ensure the video is muted in case audio wasn't already stripped
  videoEl.muted = true
  // set the event to the play function that
  videoEl.oncanplay = () => {
    vid.ctx = canvas[i].getContext('2d')
    vid.ctx.globalCompositeOperation = 'multiply'
    vid.ready = true
    // the video may not match the canvas size so find a scale to fit
    vid.scale = Math.min(
      canvas[i].width / videoEl.videoWidth,
      canvas[i].height / videoEl.videoHeight
    )
    vid.top = canvas[i].height / 2 - (videoEl.videoHeight / 2) * vid.scale
    vid.left = canvas[i].width / 2 - (videoEl.videoWidth / 2) * vid.scale
    vid.newWidth = videoEl.videoWidth * vid.scale
    vid.newHeight = videoEl.videoHeight * vid.scale
    vid.ctx.drawImage(videoEl, vid.left, vid.top, vid.newWidth, vid.newHeight)
    vid.ctx.fillStyle = slide.bgColor
    vid.ctx.beginPath()
    vid.ctx.arc(
      vid.newWidth / 2,
      vid.newHeight / 2,
      vid.newWidth,
      vid.newHeight,
      Math.PI * 2,
      false
    )
    vid.ctx.closePath()
    vid.ctx.fill()
    // only play active video if its ready (first video)
    if (slide.active && vid.ready) {
      videoEl.play()
      // the video has started playing so hand it off to the display function
      updateCanvas()
    }
  }

  // To handle errors. This is not part of the example at the moment.
  // Just fixing for Edge that did not like the ogv format video
  videoEl.onerror = () => {
    vid.ready = false
  }

  vid.el = videoEl

  return vid
}

window.addEventListener(
  'load',
  () => {
    console.log(flag)

    header()
    linesUp(slideOneHeadline, slideOne, inTimeline)
    slides.map(loadVideo)
  },
  false
)
