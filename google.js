const Router = require('dc-api-core/router');
const config = require('dc-api-core/config');
const { request } = require('.');

Router.register(config.google.loginPath, function () {
	this.redirect(`https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20email&redirect_uri=${config.google.callbackURL}&response_type=code&client_id=${config.google.id}&state=${this.session._id}`);
});

module.exports = {
	authCode (code) {
		return request('https://oauth2.googleapis.com/token', { code, client_id: config.google.id, client_secret: config.google.secret, redirect_uri: config.google.callbackURL, grant_type: 'authorization_code' });
	},
	async getInfo (access) {
		return await request(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${access.access_token}`);
	},
	async parse (ctx) {
		if (!ctx.query.code) {
			return {
				error: 'Temporary access code is required',
				code: 400
			};
		}
		
		const access = await this.authCode(ctx.query.code);
		if (access.error) {
			return {
				error: access.error_description + ' (' + access.error + ')',
				code: 400
			};
		}

		const res = await this.getInfo(access);
		return {
			id: res.id,
			email: res.email,
			firstName: res.given_name,
			lastName: res.family_name,
			avatar: res.picture
		};
	}
}
