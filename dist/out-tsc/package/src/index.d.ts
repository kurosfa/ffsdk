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
export declare class FeatureToggleSDK {
    private readonly baseUrl;
    createFeatureToggle(params: FeatureToggleParams): Promise<void>;
    deleteFeatureToggle(id: string): Promise<void>;
    getFeatureToggles(projectId?: string): Promise<FeatureToggle[]>;
    getFeatureToggle(id: string): Promise<FeatureToggle>;
    getFeatureToggleByName(name: string): Promise<FeatureToggle>;
    getFeatureToggleByNameAndProjectId(name: string, projectId: string): Promise<FeatureToggle>;
    updateFeatureToggle(id: string, params: FeatureToggleParams): Promise<void>;
}
