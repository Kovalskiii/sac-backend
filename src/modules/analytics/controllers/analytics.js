import chalk from 'chalk';
import pkg from 'lodash';

const { get } = pkg;
const log = console.log;

export default function analytics(event, params = null) {

  const supportedCategories = ['SUCCESS', 'FAIL', 'ERROR'];
  const separatorIndex = event.lastIndexOf('_');
  const analyticsCategory = event.slice(separatorIndex + 1);
  const eventCategory = supportedCategories.includes(analyticsCategory)
    ? analyticsCategory
    : 'ERROR';
  const eventAction = event.slice(0, separatorIndex);

  let user = get(params, 'user', null);
  if (user) delete params.user;

  const requestMethod = get(params, 'req.method', null);
  const endpoint = get(params, 'req.originalUrl', null);
  if (requestMethod) params.requestMethod = requestMethod;
  if (endpoint) params.endpoint = endpoint;
  delete params.req;

  console.log(event, eventCategory, eventAction);

  const message = chalk`
      event: {yellow ${event}}
      params: {yellow ${JSON.stringify(params)}}
      user: {yellow ${user}}
      `;

  log(chalk.black.bgYellowBright.bold(' ANALYTICS: '), message);
}
