"use strict";

import Vue from 'vue';
import axios from "axios";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  // timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    const token = window.localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    const status = error.response && error.response.status;
    if (status === 401 || status === 403) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
      const path = window.location.pathname || '';
      if (path !== '/login' && path !== '/register') {
        if (status === 401) {
          sessionStorage.setItem('AUTH_GUARD_MESSAGE', '登录状态已失效或令牌无效，请重新登录后再访问。');
        } else {
          sessionStorage.setItem('AUTH_GUARD_MESSAGE', '当前账号无权执行该操作，请使用具备相应权限的账号登录。');
        }
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      }
    },
    $axios: {
      get() {
        return _axios;
      }
    },
  });
};

Vue.use(Plugin)

export default Plugin;
