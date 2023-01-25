const page = document.querySelector('body')

page.addEventListener("click", createSpan)

function createSpan(e) {
    let span = document.createElement('span')
    span.className = "cursor_effect";
    span.style.top = `${e.pageY}px`
    span.style.left = `${e.pageX}px`

    page.appendChild(span)

    setTimeout (() => {
        span.remove()
    }, 1000)
}