import { Observable } from "rxjs";
export type FeatureToggle = {
    id: string;
    name: string;
    projectId: number;
    status: boolean;
};
export interface FeatureToggleSDKInterface {
    getFeatureToggle(id: string): any;
    getFeatureToggleByNameAndProjectId(name: string, projectId: number): any;
    getFeatureToggles(projectId: number): any;
}
export declare class FeatureToggleSDK implements FeatureToggleSDKInterface {
    getFeatureToggles(projectId: number): Promise<FeatureToggle[]>;
    getFeatureToggle(id: string): Promise<FeatureToggle>;
    getFeatureToggleByNameAndProjectId(name: string, projectId: number): Promise<FeatureToggle>;
}
export declare class RxFeatureToggleSDK implements FeatureToggleSDKInterface {
    getFeatureToggle(id: string): Observable<FeatureToggle>;
    getFeatureToggles(projectId: number): Observable<FeatureToggle[]>;
    getFeatureToggleByNameAndProjectId(name: string, projectId: number): Observable<FeatureToggle>;
}
