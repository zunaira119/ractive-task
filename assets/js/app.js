Ractive({
    // ...
    on: {
      init () {
        console.log('I will print during init')
      },
      '*.somethingHappened': {
        handler ( ctx ) {
          console.log('I will fire when this instance or any child component fires an instance event named "somethingHappened"')
        },
        once: true
      }
    },
    // ...
  })