# template

```pug
mixin link(q)
  a(href='definition?q='+q.toLowerCase())= q

mixin example(eg)
  //- eg.replace(/{-/g,'<a href="definition?q=').replace(/-:-/g,'">').replace(/-}/g,'</a>')
  eg

mixin result(o)
  each raw, w in o
    if raw.hasOwnProperty('formOf')
      +definition(raw, w)
    else
      +translation(raw, w)

mixin translation(raw, w)
  dl.definition.sentence
    dt
      p= w
        span.speech(class=lang.tar).zA.icon-sound
    dd
      each e, s in raw
        +definition(e, s)

mixin definition(raw, w)
  dl.definition.word
    dt
      p= w
        span.speech.en.zA.icon-volume-up
    dd
      if raw.meaning
        each define,grammar in raw.meaning
          dl(class=grammar.toLowerCase())
            dt
              span= grammar
            dd
              each mean,ty in define
                p!= mean.v.replace(/\{-(.*?)\-}/g, '<a href="definition?q=$1">$1</a>')
                if mean.exam
                  ul.eg
                    each eg in mean.exam
                      li!= eg.replace(/\{-(.*?)\-}/g, '<a href="definition?q=$1">$1</a>')

      if raw.pos
        if raw.pos.length
          dl.thesaurus.pos
            dt
              span Part of speech
            dd
              ul
                each k in raw.pos
                  li(class=k.wame.toLowerCase()) #[a(href='definition?q='+k.word)= k.word] #[span= k.wame] #[em= k.dame]

      if raw.formOf
        if raw.formOf.length
          dl.thesaurus.pos
            dt
              span ...form Of
            dd
              ul
                each k in raw.formOf
                  li!= k.replace(/\{-(.*?)\-}/g, '<a href="definition?q=$1">$1</a>')

      if raw.notation
        dl.number.a1
          dt
            span= raw.notation.number
          dd
            ul
              each k in raw.notation.notation
                li= k.sense

      if raw._math
        each o,name in raw._math
          dl.math.a1
            dt
              span= name
            dd
              ul
                each v,k in o
                  li #[em #{k}]: #{v}!

      if raw.thesaurus
        if raw.thesaurus.length
          dl.thesaurus.a1
            dt
              span Thesaurus
            dd
              p
                each k in raw.thesaurus
                  +link(k)
      if raw.antonym
        if raw.antonym.length
          dl.thesaurus.antonym
            dt
              span Antonym
            dd
              p
                each k in raw.antonym
                  +link(k)

      if raw.synonym
        if raw.synonym.length
          dl.thesaurus.synonym
            dt
              span Synonym
            dd
              p
                each k in raw.synonym
                  +link(k)