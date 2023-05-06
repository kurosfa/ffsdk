import axios from 'axios';
import { from, map } from "rxjs";
const BASE_URL = 'http://localhost:8080';
const REQUIREMENT_URL = BASE_URL + '/api/v1/requirements';
const REQUIREMENT_BY_PROJECT_URL = REQUIREMENT_URL + '/by-project-id';
// http://localhost:8080/api/v1/requirements/by-project-id
const projectId = 2;
let FEATURES = [];
export class FeatureToggleSDK {
    async getFeatureToggles(projectId) {
        const url = REQUIREMENT_BY_PROJECT_URL + `/${projectId}`;
        const response = await axios.get(url);
        return response.data;
    }
    async getFeatureToggle(id) {
        const response = await axios.get(`${REQUIREMENT_URL}/${id}`);
        return response.data;
    }
    async getFeatureToggleByNameAndProjectId(name, projectId) {
        const featureToggles = await this.getFeatureToggles(projectId);
        return featureToggles.find((featureToggle) => featureToggle.name === name);
    }
}
export class RxFeatureToggleSDK {
    getFeatureToggle(id) {
        return from(axios.get(`${REQUIREMENT_URL}/${id}`).then((response) => response.data));
    }
    getFeatureToggles(projectId) {
        const url = REQUIREMENT_BY_PROJECT_URL + `/${projectId}`;
        return from(axios.get(url).then((response) => response.data));
    }
    getFeatureToggleByNameAndProjectId(name, projectId) {
        return this.getFeatureToggles(projectId).pipe(map((featureToggles) => featureToggles.find((featureToggle) => featureToggle.name === name)));
    }
}
export function axiosInterceptor() {
    axios.interceptors.response.use(async function (response) {
        if (response.config.url.includes(BASE_URL)) {
            return response;
        }
        const url = REQUIREMENT_BY_PROJECT_URL + `/${projectId}`;
        const features = await axios.get(url);
        return Object.assign(Object.assign({}, response), { features: features.data });
    }, function (error) {
        return Promise.reject(error);
    });
}
export function xmlHttpRequestInterceptor() {
    let oldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url) {
        this.addEventListener('load', function () {
            if (!url.includes(BASE_URL)) {
                const xhr = new XMLHttpRequest();
                const featureUrl = REQUIREMENT_BY_PROJECT_URL + `/${projectId}`;
                xhr.open('GET', featureUrl);
                if (!url.includes(BASE_URL)) {
                    xhr.send();
                    xhr.onload = function () {
                        FEATURES = xhr.response;
                    };
                }
            }
        });
        return oldXHROpen.apply(this, arguments);
    };
}
export function fetchInterceptor() {
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
        const [resource, config] = args;
        const response = await originalFetch(resource, config);
        const featureUrl = REQUIREMENT_BY_PROJECT_URL + `/${projectId}`;
        let features = [];
        if (!response.url.includes(BASE_URL)) {
            fetch(featureUrl)
                .then((response) => response.json())
                .then((json) => features = json);
        }
        response.json = () => response
            .clone()
            .json()
            .then((data) => ({ data, features: features }));
        return response;
    };
}
//# sourceMappingURL=index.js.map