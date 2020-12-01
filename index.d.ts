import { ControllerHTTPContext } from 'dc-api-core/context'

declare interface DefaultUserInfo {
	/** User's ID in social network */
	id: number;
	/** (Optional) Email address */
	email: string | null;
	/** First name */
	firstName: string;
	/** Last name */
	lastName: string;
	/** User's profile picture URL */
	avatar: string;
}

type ParsedUserInfo = DefaultUserInfo | {
	/** Error message */
	error: string;
	/** Recommended HTTP error code */
	code: number;
}

declare class AuthenticatorBase<AccessInfo> {
	/**
	 * Get access info by temporary code
	 * @param code `this.query.code` from callback
	 * @returns Access info object
	 */
	authCode (code: string): Promise<AccessInfo>;

	/**
	 * Get user info by access info object
	 * @param access Access info object
	 */
	getInfo (access: AccessInfo): Promise<DefaultUserInfo>;

	/**
	 * Automatically get user's info by callback controller context (`this`)
	 * @param ctx Controller's context
	 */
	parse (ctx: ControllerHTTPContext): Promise<ParsedUserInfo>;
}
