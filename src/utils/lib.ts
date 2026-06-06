import mime from 'mime-types';
import { pbkdf2Sync } from 'node:crypto';
import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

import { Prisma } from '#generated/prisma/client';
import dayjs from './dayjs';

export const encrypt = (
	word: string,
	salt?: string,
	options?: {
		iterations?: number;
		keylen?: number;
		digest?: string;
	},
) => {
	return pbkdf2Sync(
		word,
		salt || new Date().toISOString(),
		options?.iterations || 1000,
		options?.keylen || 64,
		options?.digest || 'sha512',
	).toString('hex');
};

export const valueOrSkip = <T>(value?: T | null | undefined): T | typeof Prisma.skip => {
	return value ?? Prisma.skip;
};

export const valueNullOrSkip = <T>(value?: T | null | undefined): T | null | typeof Prisma.skip => {
	if (typeof value === 'undefined') {
		return Prisma.skip;
	}

	return value ?? Prisma.skip;
};

export const slugify = (str: string, delimiter?: string) =>
	str
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/^\s+|\s+$/g, '')
		.toLowerCase()
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, delimiter || '-')
		.replace(/-+/g, delimiter || '-');

export const mime2Ext = (mimetype: string) => {
	return mime.extension(mimetype);
};

type CreateFileInput = {
	file: Blob | ArrayBuffer | Uint8Array | Buffer;
	fileName?: string;
	fileId?: number | string;
	path: string;
	mimetype: string;
};

type CreateFileResult = {
	fileName: string;
	path: string;
};

export async function base64ToBlob(base64String: string) {
	const matches = base64String.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);

	if (!matches || matches.length !== 3) {
		throw new Error("Invalid Base64 string format. Expected 'data:<mime>;base64,<data>'");
	}

	const mimeType = matches[1];
	const base64Data = matches[2];

	if (!mimeType) {
		throw new Error('Invalid MIME type');
	}

	if (!base64Data) {
		throw new Error('Invalid Base64 data');
	}

	if (!mimeType.startsWith('image/')) {
		throw new Error(`Forbidden file type: ${mimeType}. Only images are allowed.`);
	}

	const buffer = Buffer.from(base64Data, 'base64');

	const file = new Uint8Array(buffer);

	const blob = new Blob([file]);

	if (!blob.type.startsWith('image/')) {
		throw new Error('Invalid file type: Only images are allowed.');
	}

	return blob;
}

const buildPublicPath = (path: string, fileName: string) => {
	return join('public', path, fileName);
};

export const getFile = async (fileName: string, path: string) => {
	const fullPath = buildPublicPath(path, fileName);

	const file = Bun.file(fullPath);

	if (!(await file.exists())) return null;

	return await file.text();
};

export const getFiles = async (path: string) => {
	return await readdir(join(path));
};

export const createFile = async ({
	file,
	fileName,
	fileId = dayjs().unix(),
	path,
	mimetype,
}: CreateFileInput): Promise<CreateFileResult> => {
	const fileExt = mime2Ext(mimetype);
	const name = fileName ?? `${fileId}.${fileExt}`;

	const fullPath = buildPublicPath(path, name);

	await Bun.write(fullPath, file);

	return {
		fileName: name,
		path,
	};
};

export const deleteFile = async (fileName: string, path: string) => {
	const fullPath = buildPublicPath(path, fileName);

	try {
		await rm(fullPath, { force: true });
	} catch {
		// ignore
	}
};

export const transpileFile = async (fileContent: string) => {
	const transpiler = new Bun.Transpiler({
		target: 'browser',
		trimUnusedImports: true,
		minifyWhitespace: true,
		deadCodeElimination: true,
	});

	return await transpiler.transform(fileContent);
};

export const linkAsset = (path: string, fileName: string) => {
	return `${process.env.BASE_URL}/assets/${path}/${fileName}`;
};
