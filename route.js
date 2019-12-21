// const {Navigation} = require('.');
const app = require('.');

app.Navigation('navAPI')
  .route({url: '/api',route: 'api', text: 'API'});
  // .route({url: '/test',route: 'test'});

app.Navigation('navDictionary')
  .route({url: '/dictionary/:id?',route: 'dictionary', text: 'Dictionary'});

app.Navigation('navDefinition')
  .route({url: '/definition',route: 'definition', text: 'Definition'});

app.Navigation('navTerms')
  .route({url: '/privacy',route: 'privacy', text: 'Privacy'})
  .route({url: '/terms',route: 'terms', text: 'Terms'});

app.Navigation('navPage')
  .route({url: '/',route: 'home', text: 'Home'})
  .route({url: '/about',route: 'about', text: 'About'})
  .route({url: '/grammar',route: 'grammar', text: 'Grammar'})
  .route({url: '/myanmar-fonts',route: 'fonts', text: 'Fonts'});

app.Navigation('navFallback')
  .route({url: '*',route: 'home', text: 'Fallback'})
