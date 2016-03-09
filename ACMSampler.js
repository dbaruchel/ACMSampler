/*global Touches: true, Directions: true, Sons: true */

// Collection pour communiquer les touches tapees
Touches = new Mongo.Collection('touches');

//Definition des directions: URL des pages 'vers'
Directions = ['ouest', 'nord', 'est', 'sud'];

//Definition des sons
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
    fileName: 'ACM7_passages',
  },
  {
    fileName: 'ACM8_reperes',
  },
  {
    fileName: 'ACM9_echappee',
  },
];

const sonExtension = 'm4a';

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

  // On se positionne en cercle pour se la peter
  // http://stackoverflow.com/questions/8436187/circular-layout-of-html-elements
  Template.coeur.rendered = function() {
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
  };

  //donnees et events des directions
  Template.direction.events({
    'click .direction-name': function(event, template) {
      Router.go('vers', {directionName: this.name});
    },
  });

  Template.direction.helpers({
    'touchOccurences': function() {
      return Touches.findOne({name: this.name})
        .touchOccurences;
    },
    'sonCourant': function() {
      return Touches.findOne({name: this.name})
        .currentTouch;
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
      if (aKeyCode + Sons.length - 1 < e.which) {
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
