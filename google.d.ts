type AccessInfo = {
	/** The token that your application sends to authorize a Google API request */
	access_token: string;
	/** The remaining lifetime of the access token in seconds */
	expires_in: number;
	/** A token that you can use to obtain a new access token. Refresh tokens are valid until the user revokes access. Again, this field is only present in this response if you set the access_type parameter to offline in the initial request to Google's authorization server. */
	refresh_token: string;
	/** The scopes of access granted by the access_token expressed as a list of space-delimited, case-sensitive strings */
	scope: string;
	/** The type of token returned. At this time, this field's value is always set to Bearer. */
	token_type: string;
};

import { AuthenticatorBase } from '.';
export = new AuthenticatorBase<AccessInfo>();
