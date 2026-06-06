import { getTimeRotatingFileSink } from '@logtape/file';
import { configure, getConsoleSink, getLogger } from '@logtape/logtape';

const customCategory = {
	cronTask: 'cronTask',
};

export const cronLogger = getLogger([customCategory.cronTask]);

export async function initLogger() {
	await configure({
		sinks: {
			console: getConsoleSink(),
			file: getTimeRotatingFileSink({
				directory: './logs/',
				interval: 'daily',
				nonBlocking: true,
				maxAgeMs: 60 * 24 * 60 * 60 * 1000,
				formatter: (log) => JSON.stringify(log.properties) + '\n',
			}),
			cronfile: getTimeRotatingFileSink({
				directory: './logs/cron/',
				interval: 'daily',
				nonBlocking: true,
				maxAgeMs: 60 * 24 * 60 * 60 * 1000,
			}),
		},
		loggers: [
			{
				category: ['elysia'],
				sinks: ['console', 'file'],
				lowestLevel: 'warning',
			},
			{
				category: ['logtape', 'meta'],
				sinks: ['console', 'file'],
				lowestLevel: 'warning',
			},
			{
				category: [customCategory.cronTask],
				sinks: ['console', 'cronfile'],
				lowestLevel: 'debug',
			},
		],
	});
}
