export enum RuleKeys {
    'warningTextSizesShouldBeEqual',
    'warningInvalidButtonSize',
    'warningInvalidButtonPosition',
    'warningInvalidPlaceholderSize',
    'textSeveralH1',
    'textInvalidH2Position',
    'textInvalidH3Position',
    'gridTooMuchMarketingBlocks',
}

export const ruleKeysResolveMap: { [key: string]: RuleKeys } = {
    'WARNING.TEXT_SIZES_SHOULD_BE_EQUAL': RuleKeys.warningTextSizesShouldBeEqual,
    'WARNING.INVALID_BUTTON_SIZE': RuleKeys.warningInvalidButtonSize,
    'WARNING.INVALID_BUTTON_POSITION': RuleKeys.warningInvalidButtonPosition,
    'WARNING.INVALID_PLACEHOLDER_SIZE': RuleKeys.warningInvalidPlaceholderSize,
    'TEXT.SEVERAL_H1': RuleKeys.textSeveralH1,
    'TEXT.INVALID_H2_POSITION': RuleKeys.textInvalidH2Position,
    'TEXT.INVALID_H3_POSITION': RuleKeys.textInvalidH3Position,
    'GRID.TOO_MUCH_MARKETING_BLOCKS': RuleKeys.gridTooMuchMarketingBlocks,
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
