const Router = require('dc-api-core/router');
const config = require('dc-api-core/config');
const { request } = require('.');

const API_VERSION = '5.101';

Router.register(config.vk.loginPath, function () {
	this.redirect(`https://oauth.vk.com/authorize?client_id=${config.vk.id}&redirect_uri=${config.vk.callbackURL}&scope=email&display=page&response_type=code&state=${this.session._id}`);
});

module.exports = {
	authCode (code) {
		return request(`https://oauth.vk.com/access_token?client_id=${config.vk.id}&client_secret=${config.vk.secret}&redirect_uri=${config.vk.callbackURL}&code=${code}`);
	},
	async getInfo (access) {
		const fields = config.vk.fields || 'first_name,photo_200_orig,email';
		const res = await request(`https://api.vk.com/method/users.get?user_id=${access.user_id}&access_token=${access.access_token}&fields=${fields}&v=${API_VERSION}`);
		// TODO: error handling
		return res.response[0];
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
			email: access.email,
			firstName: res.first_name,
			lastName: res.last_name,
			avatar: res.photo_200_orig
		};
	}
};
