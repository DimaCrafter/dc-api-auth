type AccessInfo = {
	access_token: string,
	expires_in: number,
	user_id: number,
	email: string | null
};

import { AuthenticatorBase } from '.';
export = new AuthenticatorBase<AccessInfo>();
