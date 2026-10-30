import type { Locale } from './config';
import type en from './dictionaries/en.json';

export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
	en: () => import('./dictionaries/en.json').then((module) => module.default),
	fr: () => import('./dictionaries/fr.json').then((module) => module.default),
	ar: () => import('./dictionaries/ar.json').then((module) => module.default),
};

export const getDictionary = (lang: Locale) => dictionaries[lang]();
