var ghpages = require('gh-pages');
 
ghpages.publish('build/default', function(err) {
	console.log('build done', err)
});
