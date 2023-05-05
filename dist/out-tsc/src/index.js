import axios from 'axios';
import { from, map } from "rxjs";
const BASE_URL = 'http://localhost:8080';
const REQUIREMENT_URL = BASE_URL + '/api/v1/requirements';
const REQUIREMENT_BY_PROJECT_URL = REQUIREMENT_URL + '/by-project-id';
const projectId = 2;
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
        const url = REQUIREMENT_BY_PROJECT_URL + `/${projectId}`;
        let features = {};
        if (response.config.url.includes(BASE_URL)) {
            features = await axios.get(url).then((response) => response.data);
        }
        return Object.assign(Object.assign({}, response), { features });
    }, function (error) {
        return Promise.reject(error);
    });
}
//# sourceMappingURL=index.js.map