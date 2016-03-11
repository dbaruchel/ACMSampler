# Au Coeur du Marais Sampler
A multi-window sound sampler for interactive multiplayer sound and visual plays.
Made with Meteor and CreateJS

![Screenshoot of the player](http://i.imgur.com/zT86gSv.png)

The /coeur url is the main sound display

Each other direction of the form /vers/<direction> such as /vers/nord at the top of the screen, /vers/south at the bottom, /vers/west left etc... is a controller:

(In order, to, for example, make a local network setup with 4 computers as "joypads" with a jammer each and one big live display with videoprojection.)


# Features
__All the easy to modify code, for customisation is at the beginning of ACMSampler.js__

__You won't have difficulty knowing which assets (in /public) are placeholders and which ones are original parts of ACM ;p__

__Use inline style or .css to modify ACMSampler.html Beware of breaking functionalities if you start removing template helpers or changing html blocks ! Always verify things still work (sound in particular) if you start messing with the HTML directly ;P__

* __Nombreux passages Au Coeur du Marais__ - You can have as many directions as you want. Just change the Directions Array line 8. For example you could have `['est', 'sud-est', 'sud', 'ouest', 'nord-ouest', 'nord']` instead, if you were 6 players.

* __Tant de caches pour ne pas dire de fous__ - You can have as many sounds as you want. Just try to make them in .m4a, and add them to /public (where are the previous ones), and add a corresponding line to the Sons Array at the beginning of ACMSampler.js.

* __A l'étroit entre les pierres__ - Only one sound can be played by each direction at a time, but different directions can play at the same time.

* __C'est la Vie qui Résonne.__ - An image can be associated with each sound (some sample images are provided here). See the Sons Array at the beginning of ACMSampler.js, and the /public/images folder.

* __Elle tatonne.__ - Each /vers/ controller can be directed with keyboard touches: press a - b - c... (depends on how mnay sounds you have) to play sounds directly

* __S'échapper une lueur verte__ - A html snippet can be associated with each sound. See the Sons Array at the beginning of ACMSampler.js. `htmlText: 'blablabla...'` 

* __le Sacré Coeur Veille mes oreilles__ - South is closest (louder sound), West is the most panned to left, North is farthest (lower sound), East is the most panned to the right.

* __Repère de fuyard__ - /vers/<direction> controllers pages have local feedback of the sound played

# Installation
Clone this repository to your computer somewhere `git clone https://github.com/mcoenca/ACMSampler.git`.
Fork it and clone your own copy repository if you find it easier to work with git ;)

You need Meteor to run this app. Here are the installation details https://www.meteor.com/install[Meteor](https://www.meteor.com/install)

Once you've installed meteor, in the command line, just go in the ACMSampler/ directory and do `meteor run`

Open 5 (or just 2 ;p ) browser windows (Chrome preferred for audio treatment). put localhost:3000/coeur in the middle, localhost:3000/vers/nord at the top, /vers/sud bottom.... 
And start clicking around the stuff in vers/ windows to see what happens in the /coeur.

Enjoy !


