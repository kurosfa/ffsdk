import axios from 'axios';
import { from, map } from "rxjs";
const BASE_URL = 'localhost:8080/api/v1/requirements';
export class FeatureToggleSDK {
    async getFeatureToggles(projectId) {
        let url = BASE_URL;
        if (projectId) {
            url += `/by-project-id/${projectId}`;
        }
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
        let url = BASE_URL;
        if (projectId) {
            url += `/by-project-id/${projectId}`;
        }
        return from(axios.get(url).then((response) => response.data));
    }
    getFeatureToggleByNameAndProjectId(name, projectId) {
        return this.getFeatureToggles(projectId).pipe(map((featureToggles) => featureToggles.find((featureToggle) => featureToggle.name === name)));
    }
}
//# sourceMappingURL=index.js.map