import { createHash, timingSafeEqual } from 'node:crypto';

const digest = (value: string) => createHash('sha256').update(value).digest();

// Compares a secret sent by the CMS with ours in constant time, so the response time gives nothing away. Hashing first
// gives both sides the same length, which timingSafeEqual needs. An unset secret never matches.
export function matchesSecret(value: string | null, secret: string | undefined) {
	if (!value || !secret) return false;

	return timingSafeEqual(digest(value), digest(secret));
}
