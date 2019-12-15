# template

```pug
mixin link(q)
  a(href='definition?q='+q.toLowerCase())= q

mixin example(eg)
  //- eg.replace(/{-/g,'<a href="definition?q=').replace(/-:-/g,'">').replace(/-}/g,'</a>')
  eg

mixin testing(o)
  each raw, w in o
    if raw.hasOwnProperty('_formOf')
      //- p.def= w
      +testing_definition(raw, w)
    else
      //- p.tra= w
      +testing_translation(raw, w)

mixin testing_translation(raw, w)
  dl.definition.sentence
    dt.dt
      p= w
        span.speech(class=lang.tar).zA.icon-sound
    dd.dd
      each e, s in raw
        +testing_definition(e, s)

mixin testing_definition(raw, w)
  dl.definition.word
    dt.dt
      p= w
        span.speech.en.zA.icon-volume-up
    dd.dd
      p working definition

mixin translation(o)
  dl.definition.sentence
    each raw, w in o
      dt.dt
        p= w
          span.speech(class=lang.tar).zA.icon-sound
      dd.dd
        +definition(raw)

mixin definition(o)
  dl.definition.word
    each raw, w in o
      dt.dt
        p= w
          span.speech.en.zA.icon-volume-up
      dd.dd
        if raw._definition
          each define,grammar in raw._definition
            dl(class=grammar.toLowerCase())
              dt
                span= grammar
              dd
                each mean,ty in define
                  p!= mean.v
                  if mean.exam
                    ul.eg
                      each eg in mean.exam
                        li!= eg.replace(/\{-(.*?)\-}/g, '<a href="definition?q=$1">$1</a>')

        if raw.pos
          if raw.pos.length
            dl.thesaurus.pos
              dt
                span Part of speech
              dd.dd
                ul
                  each k in raw.pos
                    li(class=k.wame.toLowerCase()) #[a(href='definition?q='+k.word)= k.word] #[span= k.wame] #[em= k.dame]

        if raw._thesaurus
          if raw._thesaurus.length
            dl.thesaurus.a1
              dt
                span Thesaurus
              dd.dd
                p
                  each k in raw._thesaurus
                    +link(k)
        if raw.antonym
          if raw.antonym.length
            dl.thesaurus.antonym
              dt
                span Antonym
              dd.dd
                p
                  each k in raw.antonym
                    +link(k)

        if raw.synonym
          if raw.synonym.length
            dl.thesaurus.synonym
              dt
                span Synonym
              dd.dd
                p
                  each k in raw.synonym
                    +link(k)

        if raw.mobyNormal
          if raw.mobyNormal.length
            dl.thesaurus.moby
              dt
                span Moby
              dd.dd
                p
                  each k in raw.mobyNormal
                    +link(k)

        if raw.mobyReverse
          if raw.mobyReverse.length
            dl.thesaurus.mobyReverse
              dt
                span Thesaurus
              dd.dd
                p
                  each k in raw.mobyReverse
                    +link(k)
