import GenerateSummary from './extensions/components/GenerateSummary';

export default {
    config: {
        locales: [
            // 'ar',
            // 'fr',
            // 'cs',
            // 'de',
            // 'dk',
            // 'es',
            // 'he',
            // 'id',
            // 'it',
            // 'ja',
            // 'ko',
            // 'ms',
            // 'nl',
            // 'no',
            // 'pl',
            // 'pt-BR',
            // 'pt',
            // 'ru',
            // 'sk',
            // 'sv',
            // 'th',
            // 'tr',
            // 'uk',
            // 'vi',
            // 'zh-hant',
            // 'zh',
        ],
    },
    bootstrap(app: any) {
        try {
            app.injectContentManagerComponent('editView', 'right-links', {
                name: 'generate-summary-button',
                Component: GenerateSummary,
            });
        } catch (e) {
            console.error('Failed to inject GenerateSummary button', e);
        }
    },
};
