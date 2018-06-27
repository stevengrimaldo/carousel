import { updateCanvas } from '../'

export default (canvas, slides, currentSlideIndex) => {
  const videos = slides.map((slide, i) => {
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
      vid.vidH = videoEl.videoHeight
      vid.vidW = videoEl.videoWidth
      // the video may not match the canvas size so find a scale to fit
      vid.scale = Math.min(
        canvas[i].width / vid.vidW,
        canvas[i].height / vid.vidH
      )
      vid.top = canvas[i].height / 2 - (vid.vidH / 2) * vid.scale
      vid.left = canvas[i].width / 2 - (vid.vidW / 2) * vid.scale
      vid.newWidth = vid.vidW * vid.scale
      vid.newHeight = vid.vidH * vid.scale
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
  })

  return videos
}
