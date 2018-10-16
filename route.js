/*
var {nav} = require('./');
nav()
var app = require('./');
app.nav()
*/
var app = require('./');

app.nav('navAPI')
  .route({url: '/api',route: 'api', text: 'API'});
// (/:langName) ?/:id ?/*
app.nav('navDictionary')
  .route({url: '/dictionary/:id?',route: 'dictionary', text: 'Dictionary'});
// app.nav('navDictionarys')
//   .route({url: '/dictionary/:id',route: 'dictionary', text: 'Dictionary'});

app.nav('navDefinition')
  .route({url: '/definition',route: 'definition', text: 'Definition'});

app.nav('navTerms')
  .route({url: '/privacy',route: 'home', text: 'Privacy'})
  .route({url: '/terms',route: 'home', text: 'Terms'});

app.nav('navPage')
  .route({url: '/',route: 'home', text: 'Home'})
  .route({url: '/about',route: 'about', text: 'About'})
  .route({url: '/myanmar-fonts',route: 'home', text: 'Fonts'})
  .route({url: '/grammar',route: 'home', text: 'Grammar'});
app.nav('navFallback')
  .route({url: '*',route: 'home', text: 'Fallback'})

// app.nav('navFallback')
//   .route({url: '/',route: 'home', text: 'Fallback'})
