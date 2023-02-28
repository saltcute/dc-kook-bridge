import Kasumi from 'kasumi.js';
import config from '../config/config';

export const client = new Kasumi({
    type: 'websocket',
    token: config.kookToken
})