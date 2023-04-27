import { Observable } from "rxjs";
export type FeatureToggle = {
    id: string;
    name: string;
    projectId: string;
    enabled: boolean;
};
export interface FeatureToggleSDKInterface {
    getFeatureToggle(id: string): any;
    getFeatureToggleByName(name: string): any;
    getFeatureToggleByNameAndProjectId(name: string, projectId: string): any;
    getFeatureToggles(projectId?: string): any;
}
export declare class FeatureToggleSDK implements FeatureToggleSDKInterface {
    getFeatureToggles(projectId?: string): Promise<FeatureToggle[]>;
    getFeatureToggle(id: string): Promise<FeatureToggle>;
    getFeatureToggleByName(name: string): Promise<FeatureToggle>;
    getFeatureToggleByNameAndProjectId(name: string, projectId: string): Promise<FeatureToggle>;
}
export declare class RxFeatureToggleSDK implements FeatureToggleSDKInterface {
    getFeatureToggle(id: string): Observable<FeatureToggle>;
    getFeatureToggles(projectId?: string): Observable<FeatureToggle[]>;
    getFeatureToggleByName(name: string): Observable<FeatureToggle>;
    getFeatureToggleByNameAndProjectId(name: string, projectId: string): Observable<FeatureToggle>;
}
