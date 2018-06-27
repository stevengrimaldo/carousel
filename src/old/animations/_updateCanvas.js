export default (canvas, slides, slideIndex) => {
  const updateCanvas = () => {
    slides[slideIndex].video.ctx.clearRect(
      0,
      0,
      canvas[slideIndex].width,
      canvas[slideIndex].height
    )
    slides[slideIndex].video.ctx.drawImage(
      slides[slideIndex].video.el,
      slides[slideIndex].video.left,
      slides[slideIndex].video.top,
      slides[slideIndex].video.newWidth,
      slides[slideIndex].video.newHeight
    )
    slides[slideIndex].video.ctx.globalCompositeOperation = 'multiply'
    slides[slideIndex].video.ctx.fillStyle = slides[slideIndex].bgColor
    slides[slideIndex].video.ctx.beginPath()
    slides[slideIndex].video.ctx.arc(
      slides[slideIndex].video.newWidth / 2,
      slides[slideIndex].video.newHeight / 2,
      slides[slideIndex].video.newWidth,
      slides[slideIndex].video.newHeight,
      Math.PI * 2,
      false
    )
    slides[slideIndex].video.ctx.closePath()
    slides[slideIndex].video.ctx.fill()
  }

  requestAnimationFrame(updateCanvas)
}
