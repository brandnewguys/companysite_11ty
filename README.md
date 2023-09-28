# Brand New Guys

This repository contains the Brand New Guys company website. 

## Getting Started
To get started on the development please install the correct versions of the environment & dependencies

### install environment
Please make sure at least ruby `2.7.x` & node `14.15.x` are installed
```
rvm use 2.7.2
nvm install 14.15.1
nvm use 
```

### install dependencies
```
bundle install
npm install
```

### build
```
npm run build
```

### Launch
```
npm run serve
# default port 8080
# check what port has been selected if port 8080 is already in use
```

## Credits
This project is based on a codrops template  
[Article on Codrops](https://tympanus.net/codrops/?p=51966)  
[Demo](http://tympanus.net/Tutorials/ParallaxSliderHoverReveal/)


## BNG Notes

_data folder contains meta data that is rendered to the homepage
_includes containes templates for page rendering
	podcast_index.liquid is the index page for all podcasts template
	podcast_single.liquid is the single podcast template
	home.liquid is the BNG homepage template
cases contains the cases displayed on the homepage. Each case has a 'case' tag, so it get's added to the cases collection.
deepcuts contains the podcasts displayed on the podcast index page. Each case has a 'podcast' tag, so it get's added to the podcast collection.
static contains all css, js, images, fonts AND staticcally rendered pages. There's a directive in Eleventy.js config file to copy these over.
uploads is a legacy folder that contains, logo and the balie video (for some reason).


When adding new pages. Make sure you prepend url to assest with '/dist/' for correct resolving. And of course add it to the parcel build chain if it has a build process!
