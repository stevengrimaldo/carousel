export default (url, success) => {
  const xhr = window.XMLHttpRequest
    ? new XMLHttpRequest()
    : new ActiveXObject('Microsoft.XMLHTTP')

  xhr.open('GET', url)
  xhr.onreadystatechange = () => {
    if (xhr.readyState > 3 && xhr.status === 200) {
      success(xhr.responseText)
    }
  }

  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
  xhr.send()

  return xhr
}