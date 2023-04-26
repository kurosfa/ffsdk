import axios from 'axios';

export type Condition = {
    parameter: string;
    operator: string;
    values: string[];
};

export type FeatureToggle = {
    id: string;
    name: string;
    projectId: string;
    enabled: boolean;
    conditions: Condition[];
};

export type FeatureToggleParams = {
    name: string;
    projectId: string;
    enabled: boolean;
    conditions: Condition[];
};

export class FeatureToggleSDK {
    private readonly baseUrl = 'https://example.com/api/feature-toggles';

    public async createFeatureToggle(params: FeatureToggleParams): Promise<void> {
        const response = await axios.post(this.baseUrl, params);
        return response.data;
    }

    public async deleteFeatureToggle(id: string): Promise<void> {
        const response = await axios.delete(`${this.baseUrl}/${id}`);
        return response.data;
    }

    public async getFeatureToggles(projectId?: string): Promise<FeatureToggle[]> {
        let url = this.baseUrl;
        if (projectId) {
            url += `?projectId=${projectId}`;
        }
        const response = await axios.get(url);
        return response.data;
    }

    public async getFeatureToggle(id: string): Promise<FeatureToggle> {
        const response = await axios.get(`${this.baseUrl}/${id}`);
        return response.data;
    }

    public async getFeatureToggleByName(name: string): Promise<FeatureToggle> {
        const featureToggles = await this.getFeatureToggles();
        return featureToggles.find((featureToggle) => featureToggle.name === name);
    }

    public async getFeatureToggleByNameAndProjectId(name: string, projectId: string): Promise<FeatureToggle> {
        const featureToggles = await this.getFeatureToggles(projectId);
        return featureToggles.find((featureToggle) => featureToggle.name === name);
    }

    public async updateFeatureToggle(id: string, params: FeatureToggleParams): Promise<void> {
        const response = await axios.put(`${this.baseUrl}/${id}`, params);
        return response.data;
    }
}
