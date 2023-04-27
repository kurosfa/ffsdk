import axios from 'axios';
import { from } from "rxjs";
const BASE_URL = '{{host}}/api/v1/requirements';
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
    async getFeatureToggleByName(name) {
        const featureToggles = await this.getFeatureToggles();
        return featureToggles.find((featureToggle) => featureToggle.name === name);
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
    getFeatureToggleByName(name) {
        return from(axios.get(BASE_URL).then((response) => response.data).then((featureToggles) => featureToggles.find((featureToggle) => featureToggle.name === name)));
    }
    getFeatureToggleByNameAndProjectId(name, projectId) {
        return from(axios.get(BASE_URL + `/by-project-id/${projectId}`).then((response) => response.data).then((featureToggles) => featureToggles.find((featureToggle) => featureToggle.name === name)));
    }
}
//# sourceMappingURL=index.js.map