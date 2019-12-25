# Prev

...

```pug
extends layout
block header
  include header
block content
  div.portal.dictionary#content
    div.resize
      div.wrapper
        div.row.about
          div.width-wide.text-right-d
            p MyOrdbok was launched in 2008. Ever since our focues are adding definitions, and keeping our resouces up to date, and there are 103,379 words ready to be translated into Myanmar.
          div.width-fixed.text-center
            i.icon-flag

        div.row.social
          div.text-center
            div working #{sol.id}

        div.row
          div.dictionaries
            ol.dictionary
              each conti in dictionaries
                li(class=conti.name.toLowerCase() class={active: conti.lang.find(e=>e.id == sol.id)})
                  h3 #{conti.name}
                  ol
                    each lang in conti.lang
                      li(class=lang.id class={active: lang.id == sol.id})
                        a(data-lag=lang.id href='/dictionary/'+lang.name.toLowerCase()) #{lang.name}

block footer
  include footer
