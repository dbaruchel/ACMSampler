/* global Touches: true, Directions: true, Sons: true, SonsObjects: true, createjs */

// Collection pour communiquer les touches tapees
Touches = new Mongo.Collection('touches');

//Definition des directions: URL des pages 'vers'
//La c'est pour 4 joueurs, mais ca pourrait etre plus...
Directions = ['est', 'nord', 'ouest', 'sud'];

//Definition des sons
//Peut etre augmentee, diminuee, changee...
Sons = [
  {
    fileName: 'ACM1_full',
  },
  {
    fileName: 'ACM2_trou',
  },
  {
    fileName: 'ACM3_ciel',
  },
  {
    fileName: 'ACM4_suinte_x',
  },
  {
    fileName: 'ACM5_tatonne',
  },
  {
    fileName: 'ACM6_hivers',
  },
  {
    fileName: 'ACM7_passage',
  },
  {
    fileName: 'ACM8_reperes',
  },
  {
    fileName: 'ACM9_echappee',
  },
];
const sonExtension = 'm4a';

// Format necessite par la library Sound de createJS
// CF http://www.createjs.com/demos/soundjs/playonclick
// et https://github.com/CreateJS/SoundJS/blob/master/examples/02_PlayOnClick.html
SonsObjects = Sons.map((son, idx) => {
  return {
    fileName: son.fileName,
    src: `${son.fileName}.${sonExtension}`,
    id: idx,
  };
});

if (Meteor.isClient) {
  //Visualisation et ecoute
  Router.route('/', {
    onBeforeAction: function() {
      Router.go('coeur');
      this.next();
    },
  });
  Router.route('/coeur', {
    name: 'coeur',
    template: 'coeur',
  });

  //Controles
  Router.route('vers/:directionName', {
    name: 'vers',
    template: 'vers',
  });
}

//reset de la base de donnee
if (Meteor.isServer) {
  Meteor.startup(function() {
    Touches.remove({});

    //1 document par direction insere dans la base de donnees
    Directions.forEach((direction) => {
      Touches.insert({
        name: direction,
        currentTouch: null,
        touchOccurences: 0,
      });
    });
  });
}

// Logique des pages
//=========PAGE COEUR
if (Meteor.isClient) {
  //Donnee accessible au coeur
  Template.coeur.helpers({
    'directions': () => Directions,
  });


  Template.coeur.rendered = function() {
    // On se positionne en cercle pour se la peter
    // http://stackoverflow.com/questions/8436187/circular-layout-of-html-elements
    const directionsElems = this.$('.direction-container');
    const alpha = Math.PI * 2 / Directions.length;
    const x0 = window.innerWidth / 2;
    const y0 = window.innerHeight / 2;
    const xRadius = 0.75 * window.innerWidth / 2;
    const yRadius = 0.75 * window.innerHeight / 2;

    directionsElems.each(function(index, elem) {
      const x = x0 + xRadius * Math.cos(alpha * index);
      const y = y0 + yRadius * Math.sin(alpha * index);

      elem.style.position = 'absolute';
      elem.style['text-align'] = 'center';
      elem.style.left = `${x}px`;
      elem.style.top = `${y}px`;
    });

    // On Load les sons avec createJS
    // https://github.com/CreateJS/SoundJS/blob/master/examples/02_PlayOnClick.html
    const soundLoaded = function(event) {
      console.log('sound loaded', event.id);
    };

    const init = function() {
      if (!createjs.Sound.initializeDefaultPlugins()) {
        alert('error init createjs');
        return;
      }

      const assetsPath = '/';
      // createjs.Sound.alternateExtensions = ['mp3']; // add other extensions to try loading if the src file extension is not supported
      createjs.Sound.addEventListener('fileload', createjs.proxy(soundLoaded, this)); // add an event listener for when load is completed
      createjs.Sound.registerSounds(SonsObjects, assetsPath);
    };

    init();
  };

  Template.direction.created = function() {
    //counter of different sound touches
    this.touchOccurences = null;

    //Sound player state
    this.preload = null;
    this.stop = () => {
      if (this.preload !== null) {
        this.preload.close();
      }
      createjs.Sound.stop();
    };

    this.playSound = (target) => {
      //Play the sound: play (src, interrupt, delay, offset, loop, volume, pan)
      let instance = createjs.Sound.play(target.id, {pan: 0.0001});
      if (instance === null ||
        instance.playState === createjs.Sound.PLAY_FAILED) {
        return;
      }

      instance.addEventListener('complete', function(instance) {
        console.log('finished playing');
      });
    };
  };

  //donnees et events des directions
  Template.direction.events({
    'click .direction-name': function(event, template) {
      Router.go('vers', {directionName: this.name});
    },
  });

  Template.direction.helpers({
    'touchOccurences': function() {
      const temp = Template.instance();
      if (temp.touchOccurences === null) temp.touchOccurences = 0;

      let currentTouch = Touches.findOne({name: this.name});
      let touchOccurences = currentTouch.touchOccurences;

      //PLAY SOUND
      //Si l'occurence a bien change au reloading du helper
      //Du coup on joue le son qui correspond a la touche jouee
      if (touchOccurences !== temp.touchOccurences) {
        const soundToPlayForThisTouch = _.find(SonsObjects,
          (obj) => obj.fileName === currentTouch.currentTouch);
        temp.playSound(soundToPlayForThisTouch);
      }
      return touchOccurences;
    },
    'sonCourant': function() {
      let sonCourant = Touches.findOne({name: this.name})
        .currentTouch;
      return sonCourant;
    },
  });
}

//=========PAGES VERS
if (Meteor.isClient) {
  const updateTouch = (directionName, fileName) => {
    const touchId = Touches.findOne({name: directionName})._id;
    Touches.update({_id: touchId}, {
      $inc: {touchOccurences: 1},
      $set: {currentTouch: fileName},
    });
  };

  Template.vers.created = function() {
    this.directionName = Router.current().params.directionName;
  };

  Template.vers.helpers({
    'sons': () => Sons,
    'directionName': () => Template.instance().directionName,
  });


  Template.vers.rendered = function() {
    // On se positionne toujours en cercle pour se la peter
    const directionsElems = this.$('.son-container');
    const alpha = Math.PI * 2 / Sons.length;
    const x0 = window.innerWidth / 2;
    const y0 = window.innerHeight / 2;
    const xRadius = 0.75 * window.innerWidth / 2;
    const yRadius = 0.75 * window.innerHeight / 2;

    directionsElems.each(function(index, elem) {
      const x = x0 + xRadius * Math.cos(alpha * index);
      const y = y0 + yRadius * Math.sin(alpha * index);
      elem.style.position = 'absolute';
      elem.style['text-align'] = 'center';
      elem.style.left = `${x}px`;
      elem.style.top = `${y}px`;
    });

    $(window).on('keydown', (e) => {
      const aKeyCode = 65;
      // b=66, c =67...
      if (aKeyCode < e.which && e.which < aKeyCode + Sons.length - 1) {
        const sonIndex = e.which - aKeyCode;
        updateTouch(this.directionName, Sons[sonIndex].fileName);
        e.preventDefault();
      }
    });
  };

  //donnees et events des directions
  Template.sonTemplate.events({
    'click .son-name': function(event, template) {
      updateTouch(this.directionName, this.son.fileName);
    },
  });
}
