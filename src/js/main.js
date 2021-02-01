const Polyglot = require('node-polyglot');

const en = require('./i18n/en.js');
const lb = require('./i18n/lb.js');
const de = require('./i18n/de.js');
const fr = require('./i18n/fr.js');

const locales = {
    en,
    lb,
    de,
    fr,
};

function getCurrentLocale() {
    searchParamLocale = new URLSearchParams(location.search).get('lang') || 'en';

    return locales[searchParamLocale] && searchParamLocale || 'en';
}

const currentLocale = getCurrentLocale();

const excuses_keys = Object.keys(en.excuses);

const polyglot = new Polyglot({phrases: locales[currentLocale]});

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
        currentLocale,
        availableLocales: Object.keys(locales),
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
        twitterShareLink: 'https://twitter.com',
        whatsappShareLink: 'whatsapp://send?text=Autosfestival',
        facebookShareLink: 'https://www.facebook.com/sharer.php?u=htts://autosfestival.lu',
        getRandomExcuse() {
            this.currentExcuse = `${this.excusePrefix} ${polyglot.t(`excuses.${this.excuses[Math.floor(Math.random() * this.excuses.length)]}`)}`;
        },
        startRandomExcuseGenerator() {
            this.currentGeneratorStep = 1;
            setTimeout(this.randomExcuseGeneratorStep.bind(this), this.generatorMaxMs/(this.maxGeneratorSteps/this.currentGeneratorStep));
            this.getRandomExcuse();
        },
        randomExcuseGeneratorStep() {
            this.getRandomExcuse();
            if (this.currentGeneratorStep < this.maxGeneratorSteps) {
                this.currentGeneratorStep++;
                setTimeout(this.randomExcuseGeneratorStep.bind(this), this.generatorMaxMs/(this.maxGeneratorSteps/this.currentGeneratorStep))
            } else {
                this.noGuessYet = false;
                this.showGuessButton = true;

                const shareText = encodeURIComponent(polyglot.t('shareText', { reason: this.currentExcuse }));
                const shareUrl = encodeURIComponent('https://autosfestival.lu');
                const shareTags = encodeURIComponent('autosfestival,brummbrumm,deckeGas,SUVchen');
                this.twitterShareLink = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}&hashtags=${shareTags}`;
                this.whatsappShareLink = `whatsapp://send?text=${shareText} ${shareUrl} #autosfestival #brummbrumm #deckeGas #SUVchen`;
                this.facebookShareLink = `https://www.facebook.com/sharer.php?u=${shareUrl}&t=${shareText}%20${shareUrl}%20%2Cautosfestival%20%2Cbrummbrumm%20%2CdeckeGas%20%2CSUVchen`;
            }
        },
    };
}

module.exports = { carFestival };