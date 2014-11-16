{
  chars: [{
    name: 'player',
    code: 'p'
  },
  {
    name: 'bartender',
    code: 'b'
  }],
  dialogue: [{
    code: 'hi', // code es opcional, sirve para el goto
    value: 'Hola.',
    owner: 'p'
  },
  {
    value: 'Hola!!',
    owner: 'b'
  },
  {
    value: ['que se le ofrece?', 'Le gusta el martini?'], // muchos mismo owner
    owner: 'b'
  },
  {
    code: 'options1',
    options: [ // opciones seleccionables
      {
        code: 'a',
        value: 'Como estás?',
        dialogue: [{
          random: ['Barbaro, 10 points', 'joya chavo', 'bien bien'], // como value pero random
          after: 'goTo options1'
        }]
      },
      {
        code: 'lol',
        value: 'Me das fuego?',
        after: function(){
          this.emit('fireAdquired');
          this.say({ value: 'Gracias chaval!', owner: 'p'});
        }
      },
      {
        code: 'b',
        value: 'Me tengo que ir.' //termina la conversacion porque no hay dialogue ni after
      }
    ]
  }]
}

dialogue.goTo('code')
dialogue.say({dialoguePart})
dialogue.emit('custom')
dialogue.set('convCode', {
  enabled: false
});
dialogue.end()
