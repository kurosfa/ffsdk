import axios from 'axios';
import {from, map, Observable} from "rxjs";

export type FeatureToggle = {
    id: string;
    name: string;
    projectId: number;
    status: boolean;
};

const BASE_URL = 'http://localhost:8080/api/v1/requirements';
const projectId = 2;

export interface FeatureToggleSDKInterface {
    getFeatureToggle(id: string);

    getFeatureToggleByNameAndProjectId(name: string, projectId: number);

    getFeatureToggles(projectId: number);
}


export class FeatureToggleSDK implements FeatureToggleSDKInterface {
    public async getFeatureToggles(projectId: number): Promise<FeatureToggle[]> {
        const url = BASE_URL + `/by-project-id/${projectId}`;
        const response = await axios.get(url);
        return response.data;
    }

    public async getFeatureToggle(id: string): Promise<FeatureToggle> {
        const response = await axios.get(`${BASE_URL}/${id}`);
        return response.data;
    }

    public async getFeatureToggleByNameAndProjectId(name: string, projectId: number): Promise<FeatureToggle> {
        const featureToggles = await this.getFeatureToggles(projectId);
        return featureToggles.find((featureToggle) => featureToggle.name === name);
    }
}

export class RxFeatureToggleSDK implements FeatureToggleSDKInterface {
    public getFeatureToggle(id: string): Observable<FeatureToggle> {
        return from(axios.get(`${BASE_URL}/${id}`).then((response) => response.data));
    }

    public getFeatureToggles(projectId: number): Observable<FeatureToggle[]> {
        const url = BASE_URL + `/by-project-id/${projectId}`;
        return from(axios.get(url).then((response) => response.data));
    }

    public getFeatureToggleByNameAndProjectId(name: string, projectId: number): Observable<FeatureToggle> {
        return this.getFeatureToggles(projectId).pipe(map((featureToggles) => featureToggles.find((featureToggle) => featureToggle.name === name)));
    }
}

export function axiosInterceptor() {
    axios.interceptors.response.use(async function (response) {
        const url = BASE_URL + `/by-project-id/${projectId}`;
        let features = {}

        if (!BASE_URL.includes(response.config.baseURL)){
            features = await axios.get(url).then((response) => response.data);
        }

        return {...response, features};
    }, function (error) {
        return Promise.reject(error);
    });
}
