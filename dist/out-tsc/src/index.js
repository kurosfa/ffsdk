import axios from 'axios';
import { from, map } from "rxjs";
const BASE_URL = 'http://localhost:8080/api/v1/requirements';
const projectId = 2;
export class FeatureToggleSDK {
    async getFeatureToggles(projectId) {
        const url = BASE_URL + `/by-project-id/${projectId}`;
        const response = await axios.get(url);
        return response.data;
    }
    async getFeatureToggle(id) {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    }
    async getFeatureToggleByNameAndProjectId(name, projectId) {
        const featureToggles = await this.getFeatureToggles(projectId);
        return featureToggles.find((featureToggle) => featureToggle.name === name);
    }
}
export class RxFeatureToggleSDK {
    getFeatureToggle(id) {
        return from(axios.get(`${BASE_URL}/${id}`).then((response) => response.data));
    }
    getFeatureToggles(projectId) {
        const url = BASE_URL + `/by-project-id/${projectId}`;
        return from(axios.get(url).then((response) => response.data));
    }
    getFeatureToggleByNameAndProjectId(name, projectId) {
        return this.getFeatureToggles(projectId).pipe(map((featureToggles) => featureToggles.find((featureToggle) => featureToggle.name === name)));
    }
}
export function axiosInterceptor() {
    axios.interceptors.response.use(async function (response) {
        const url = BASE_URL + `/by-project-id/${projectId}`;
        const features = await axios.get(url).then((response) => response.data);
        return Object.assign(Object.assign({}, response), { features });
    }, function (error) {
        return Promise.reject(error);
    });
}
//# sourceMappingURL=index.js.map