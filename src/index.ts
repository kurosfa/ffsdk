import axios from 'axios';
import {from, map, Observable} from "rxjs";

export type FeatureToggle = {
    id: string;
    name: string;
    projectId: number;
    status: boolean;
};

const BASE_URL = 'http://localhost:8080';
const REQUIREMENT_URL = BASE_URL + '/api/v1/requirements';
const REQUIREMENT_BY_PROJECT_URL = REQUIREMENT_URL + '/by-project-id';
// http://localhost:8080/api/v1/requirements/by-project-id
const projectId = 2;

let FEATURES = [];

export interface FeatureToggleSDKInterface {
    getFeatureToggle(id: string);

    getFeatureToggleByNameAndProjectId(name: string, projectId: number);

    getFeatureToggles(projectId: number);
}

export class FeatureToggleSDK implements FeatureToggleSDKInterface {
    public async getFeatureToggles(projectId: number): Promise<FeatureToggle[]> {
        const url = REQUIREMENT_BY_PROJECT_URL + `/${projectId}`;
        const response = await axios.get(url);
        return response.data;
    }

    public async getFeatureToggle(id: string): Promise<FeatureToggle> {
        const response = await axios.get(`${REQUIREMENT_URL}/${id}`);
        return response.data;
    }

    public async getFeatureToggleByNameAndProjectId(name: string, projectId: number): Promise<FeatureToggle> {
        const featureToggles = await this.getFeatureToggles(projectId);
        return featureToggles.find((featureToggle) => featureToggle.name === name);
    }
}

export class RxFeatureToggleSDK implements FeatureToggleSDKInterface {
    public getFeatureToggle(id: string): Observable<FeatureToggle> {
        return from(axios.get(`${REQUIREMENT_URL}/${id}`).then((response) => response.data));
    }

    public getFeatureToggles(projectId: number): Observable<FeatureToggle[]> {
        const url = REQUIREMENT_BY_PROJECT_URL + `/${projectId}`;
        return from(axios.get(url).then((response) => response.data));
    }

    public getFeatureToggleByNameAndProjectId(name: string, projectId: number): Observable<FeatureToggle> {
        return this.getFeatureToggles(projectId).pipe(map((featureToggles) => featureToggles.find((featureToggle) => featureToggle.name === name)));
    }
}

export function axiosInterceptor() {
    axios.interceptors.response.use(async function (response) {
        if (response.config.url.includes(BASE_URL)){
            return response
        }

        const url = REQUIREMENT_BY_PROJECT_URL + `/${projectId}`;
        const features = await axios.get(url);

        FEATURES = features.data
        return {...response, features: features.data};
    }, function (error) {
        return Promise.reject(error);
    });
}

export function xmlHttpRequestInterceptor() {
    let oldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method: string, url: string) {
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
    }
}

export function fetchInterceptor() {
    const { fetch: originalFetch } = window;
    window.fetch = async (...args) => {
        const [resource, config] = args;

        const response = await originalFetch(resource, config);

        if (!response.url.includes(BASE_URL)) {
            const featureUrl = REQUIREMENT_BY_PROJECT_URL + `/${projectId}`;

            fetch(featureUrl)
                .then((response) => response.json())
                .then((json) => FEATURES = json.data);

            response.json = () =>
                response
                    .clone()
                    .json()
                    .then((data) => ({data, features: FEATURES}));
        }

        return response;
    };
}
