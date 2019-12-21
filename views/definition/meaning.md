# template

```pug
mixin word(v)
  dl.definition.word
    each v, route in navPage
      +li(v)

mixin li(v)
  li(class=v.route class={active: v.active} class={hasChild: v.child})
    a(href=(v.url=='*' ? '/' : v.url))
      span #{v.text}
    if v.child
      ol.child
        each s, route in v.child
          +li(s)

+word(v)


each s, type in row
  dl(class=grammar.toLowerCase())
    dt
      span #{grammar}
    dd.dd


each s, grammar in row
  dl(class=grammar.toLowerCase())
    dt
      span #{grammar}
    dd.dd
