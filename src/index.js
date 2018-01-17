import 'normalize-css';
import './assets/styles/default.scss';

import React from 'react';
import { render } from 'react-dom'

import Router from './common/Router';
import routes from './constants/routes';
import Application from './routes/Application';

const router = Router.create(routes);

render(
    (<Application router={router} />), document.getElementById('application')
);