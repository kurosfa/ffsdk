import axios from 'axios';
export class FeatureToggleSDK {
    constructor() {
        this.baseUrl = 'https://example.com/api/feature-toggles';
    }
    async createFeatureToggle(params) {
        const response = await axios.post(this.baseUrl, params);
        return response.data;
    }
    async deleteFeatureToggle(id) {
        const response = await axios.delete(`${this.baseUrl}/${id}`);
        return response.data;
    }
    async getFeatureToggles(projectId) {
        let url = this.baseUrl;
        if (projectId) {
            url += `?projectId=${projectId}`;
        }
        const response = await axios.get(url);
        return response.data;
    }
    async getFeatureToggle(id) {
        const response = await axios.get(`${this.baseUrl}/${id}`);
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
    async updateFeatureToggle(id, params) {
        const response = await axios.put(`${this.baseUrl}/${id}`, params);
        return response.data;
    }
}
//# sourceMappingURL=index.js.map