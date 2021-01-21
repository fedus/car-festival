const Polyglot = require('node-polyglot');

const polyglot = new Polyglot({});

function sizeViewport() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

sizeViewport();

window.addEventListener('resize', () => {
    sizeViewport();
});

function carFestival() {
    return {
        language: new URLSearchParams(location.search).get('lang') || 'en',
        showGuessButton: true,
        guess() {
            this.startRandomExcuseGenerator();
            this.showGuessButton = false;
        },
        excusePrefix: '...',
        excuses: [
            "I'm insecure",
            'I have too much money',
            'I have a child',
            'I have a pet',
            'my neighbour got one too',
            "I'm vain",
            'I never think about alternatives',
            "I'm unfit",
            'I like big oil',
            "I'm bored",
            "I don't care",
            "I think people on buses smell",
            "I like the smell of gas",
            "it is my god-given right",
            "I like the smell of my car dealership",
            "I want to be able to drive my partner to the hospital in the extremely unlikely case of an emergency",
            "only poor people take public transport",
            "I don't like François Bausch's tram",
            "my dad owned a car, so I own a car",
            "I don't care about society",
            "I have given up on being a valuable member to society"
        ],
        currentExcuse: '',
        generatorMaxMs: 150,
        maxGeneratorSteps: 15,
        currentGeneratorStep: 0,
        getRandomExcuse() {
            this.currentExcuse = `${this.excusePrefix} ${this.excuses[Math.floor(Math.random() * this.excuses.length)]}`;
        },
        startRandomExcuseGenerator() {
            this.currentGeneratorStep = 1;
            setTimeout(this.randomExcuseGeneratorStep.bind(this), this.generatorMaxMs/(this.maxGeneratorSteps/this.currentGeneratorStep));
            this.getRandomExcuse();
        },
        randomExcuseGeneratorStep() {
            if (this.currentGeneratorStep < this.maxGeneratorSteps) {
                this.currentGeneratorStep++;
                setTimeout(this.randomExcuseGeneratorStep.bind(this), this.generatorMaxMs/(this.maxGeneratorSteps/this.currentGeneratorStep))
            }
            this.getRandomExcuse();
        },
    };
}

module.exports = { carFestival };