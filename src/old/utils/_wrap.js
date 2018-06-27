// Wrap an HTMLElement around each element in an HTMLElement array.
export default (els, wrapper) => {
  // Convert `elms` to an array, if necessary.
  if (!els.length) {
    els = [els]
  }

  let i

  // Loops backwards to prevent having to clone the wrapper on the
  // first element (see `child` below).
  for (i = els.length - 1; i >= 0; i -= 1) {
    const child = i > 0 ? wrapper.cloneNode(true) : wrapper
    const el = els[i]

    // Cache the current parent and sibling.
    const parent = el.parentNode
    const sibling = el.nextSibling

    // Wrap the element (is automatically removed from its current
    // parent).
    child.appendChild(el)

    // If the element had a sibling, insert the wrapper before
    // the sibling to maintain the HTML structure; otherwise, just
    // append it to the parent.
    if (sibling) {
      parent.insertBefore(child, sibling)
    } else {
      parent.appendChild(child)
    }
  }
}
