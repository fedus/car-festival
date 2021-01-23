const Polyglot = require('node-polyglot');

const en = require('./i18n/en.js');
const lb = require('./i18n/lb.js');

const locales = {
    en,
    lb,
};

function getCurrentLocale() {
    searchParamLocale = new URLSearchParams(location.search).get('lang') || 'en';

    return locales[searchParamLocale] && searchParamLocale || 'en';
}

const current_locale = getCurrentLocale();

const excuses_keys = Object.keys(en.excuses);

const polyglot = new Polyglot({phrases: locales[current_locale]});

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
        polyglot,
        showGuessButton: true,
        showExcuse: false,
        noGuessYet: true,
        guess() {
            this.startRandomExcuseGenerator();
            this.showExcuse = true;
            this.showGuessButton = false;
            this.currentGenerateButtonLabel = polyglot.t('generateButtonAgain');
        },
        excusePrefix: '...',
        excuses: excuses_keys,
        currentExcuse: '',
        generatorMaxMs: 150,
        maxGeneratorSteps: 15,
        currentGeneratorStep: 0,
        currentGenerateButtonLabel: polyglot.t('generateButton'),
        getRandomExcuse() {
            this.currentExcuse = `${this.excusePrefix} ${polyglot.t(`excuses.${this.excuses[Math.floor(Math.random() * this.excuses.length)]}`)}`;
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
            } else {
                this.noGuessYet = false;
                this.showGuessButton = true;
            }
            this.getRandomExcuse();
        },
    };
}

module.exports = { carFestival };