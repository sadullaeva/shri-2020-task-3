export enum RuleKeys {
    'warningTextSizesShouldBeEqual'
}

export const ruleKeysResolveMap: { [key: string]: RuleKeys } = {
    'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL': RuleKeys.warningTextSizesShouldBeEqual,
};

export enum Severity {
    Error = "Error", 
    Warning = "Warning", 
    Information = "Information", 
    Hint = "Hint", 
    None = "None"
}

export type SeverityConfiguration = {
    [key: string]: Severity;
};

export interface ExampleConfiguration {
 
    enable: boolean;
 
    severity: SeverityConfiguration;
}
