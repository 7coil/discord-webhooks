const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');

const app = express();
const webhook = 'https://canary.discordapp.com/api/webhooks';

app.use(bodyParser.json())
	.post('/vsts/:channel/:token', (req, res) => {
		request({
			uri: `${webhook}/${req.params.channel}/${req.params.token}`,
			method: 'POST',
			json: true,
			body: {
				username: 'Visual Studio TFS',
				embeds: [
					{
						title: req.body.resource.repository.name,
						url: req.body.resource.url,
						description: req.body.detailedMessage.markdown,
						author: {
							name: req.body.resource.pushedBy.displayName
						},
						timestamp: req.body.resource.date
					}
				]
			}
		}, (error, response, body) => {
			res.status(response.statusCode).json(body);
		});
	})
	.use('*', (req, res) => {
		res.json({ message: 'Invalid webhook forwarder' });
	});

app.listen(8080);
