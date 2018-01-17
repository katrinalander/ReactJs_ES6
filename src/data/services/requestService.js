import axios from 'axios';

import Router from 'common/Router/Router';
import TokenService from './TokenService';

const API_NAMESPACE = API_NAMESPACE_CONFIG;
const TOKEN_HEADER_NAME = 'katrinas_token';

const getRequestHeader = () => {
    const token = TokenService.getToken();
    const tokenHeader = {};

    if (token) {
        tokenHeader[TOKEN_HEADER_NAME] = token;
    }

    const headers = {
        appCode: 'CCO',
        route: Router.getInstance().activeRoute,
        ...tokenHeader
    };

    return headers;
};

const setToken = (response) => {
    const token = response.headers[TOKEN_HEADER_NAME];

    if(token) {
        TokenService.setToken(token);
    }
};

export const setUserHeader = function(userName) {
    axios.defaults.headers.common['sm_user'] = userName;
};

export const getRequest = function (url, payload = {}, config = {}) {
    return axios({
        method: 'get',
        url: API_NAMESPACE + url,
        params: payload,
        headers: getRequestHeader(),
        withCredentials: true,
        ...config
    }).then(response => {
        setToken(response);
        return response;
    });
};

export const postRequest = function (url, payload={}, config={}) {
    const cfg = {
        headers: getRequestHeader(),
        ...config
    };

    return axios.post(API_NAMESPACE + url, payload,cfg).then(response => {
        setToken(response);
        return response;
    });
};

export const putRequest = function(url, payload={}, config={}) {
    const cfg = {
        headers: getRequestHeader(),
        ...config
    };

    return axios.put(API_NAMESPACE + url, payload, cfg).then(response => {
        setToken(response);

        return response;
    });
};

export const concurrentRequest = function(promises) {
    return axios.all(promises);
};

export const deleteRequest = function(url, id, config = {}) {
    const requestHeader = getRequestHeader();
    const cfg = {
        headers: {
            'Content-Type': 'application/json',
            ...requestHeader
        },
        data: {}, // need this line to keep 'content-type' header
        ...config
    };

    return axios.delete(API_NAMESPACE + url + '/' + id, cfg).then(response => {
        setToken(response);

        return response;
    })
};
