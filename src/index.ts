import axios from 'axios';
import {from, Observable} from "rxjs";

export type FeatureToggle = {
    id: string;
    name: string;
    projectId: string;
    enabled: boolean;
};

const BASE_URL = '{{host}}/api/v1/requirements';

export interface FeatureToggleSDKInterface {
    getFeatureToggle(id: string);

    getFeatureToggleByName(name: string);

    getFeatureToggleByNameAndProjectId(name: string, projectId: string);

    getFeatureToggles(projectId?: string);
}


export class FeatureToggleSDK implements FeatureToggleSDKInterface {
    public async getFeatureToggles(projectId?: string): Promise<FeatureToggle[]> {
        let url = BASE_URL;
        if (projectId) {
            url += `/by-project-id/${projectId}`;
        }
        const response = await axios.get(url);
        return response.data;
    }

    public async getFeatureToggle(id: string): Promise<FeatureToggle> {
        const response = await axios.get(`${BASE_URL}/${id}`);
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
}

export class RxFeatureToggleSDK implements FeatureToggleSDKInterface {
    public getFeatureToggle(id: string): Observable<FeatureToggle> {
        return from(axios.get(`${BASE_URL}/${id}`).then((response) => response.data));
    }

    public getFeatureToggles(projectId?: string): Observable<FeatureToggle[]> {
        let url = BASE_URL;
        if (projectId) {
            url += `/by-project-id/${projectId}`;
        }
        return from(axios.get(url).then((response) => response.data));
    }

    public getFeatureToggleByName(name: string): Observable<FeatureToggle> {
        return from(axios.get(BASE_URL).then((response) => response.data).then((featureToggles: FeatureToggle[]) => featureToggles.find((featureToggle) => featureToggle.name === name)));
    }

    public getFeatureToggleByNameAndProjectId(name: string, projectId: string): Observable<FeatureToggle> {
        return from(axios.get(BASE_URL + `/by-project-id/${projectId}`).then((response) => response.data).then((featureToggles) => featureToggles.find((featureToggle) => featureToggle.name === name)));
    }
}
