import { randomUUID } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import PocketBase from 'pocketbase';


export const generatePbUserToken = async (address: string) => {
	const adminClient = new PocketBase(PUBLIC_POCKETBASE_URL);
	await adminClient.collection("_superusers").authWithPassword(env.POCKETBASE_AUTH_USER, env.POCKETBASE_AUTH_PASS);

	const normalisedAddress = address.toLowerCase().replace(/^0x/, '');
	const email = `${normalisedAddress}@guest.nonon.house`;
	const tempPassword = randomUUID();

	try {
		const existingUser = await adminClient.collection("users").getFirstListItem(`email="${email}"`);
		await adminClient.collection("users").update(existingUser.id, {
			email,
			password: tempPassword,
			passwordConfirm: tempPassword
		});
	} catch {
		await adminClient.collection("users").create({
			email,
			password: tempPassword,
			passwordConfirm: tempPassword
		});
	}

	const userClient = new PocketBase(PUBLIC_POCKETBASE_URL);
	const authData = await userClient.collection("users").authWithPassword(email, tempPassword);

	return authData.token;
};
