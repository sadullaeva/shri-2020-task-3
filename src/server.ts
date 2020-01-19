import {
    createConnection,
    ProposedFeatures,
    TextDocuments,
    InitializeParams,
    TextDocument,
    Diagnostic,
    DiagnosticSeverity,
    DidChangeConfigurationParams
} from 'vscode-languageserver';

import { basename } from 'path';

import { ExampleConfiguration, Severity, RuleKeys, ruleKeysResolveMap } from './configuration';
import { lint } from './linter';

interface LinterProblem {
    code: string;
    error: string;
    location: {
        start: { column: number; line: number; };
        end: { column: number; line: number; };
    };
}

let conn = createConnection(ProposedFeatures.all);
let docs = new TextDocuments();
let conf: ExampleConfiguration | undefined = undefined;

conn.onInitialize((params: InitializeParams) => {
    return {
        capabilities: {
            textDocumentSync: docs.syncKind
        }
    };
});

function GetSeverity(key: string): DiagnosticSeverity | undefined {
    if (!conf || !conf.severity) {
        return undefined;
    }

    const ruleKey = ruleKeysResolveMap[key];
    const severity: Severity = conf.severity[RuleKeys[ruleKey]];

    switch (severity) {
        case Severity.Error:
            return DiagnosticSeverity.Information;
        case Severity.Warning:
            return DiagnosticSeverity.Warning;
        case Severity.Information:
            return DiagnosticSeverity.Information;
        case Severity.Hint:
            return DiagnosticSeverity.Hint;
        default:
            return undefined;
    }
}

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
    const source = basename(textDocument.uri);
    const json = textDocument.getText();

    const lintProblems: LinterProblem[] = lint(json) || [];
    const diagnostics: Diagnostic[] = lintProblems.reduce(
        (
            list: Diagnostic[],
            problem: LinterProblem
        ): Diagnostic[] => {
            const { code, error, location } = problem;
            const severity = GetSeverity(code);

            if (severity) {
                let diagnostic: Diagnostic = {
                    range: {
                        start: {
                            line: location.start.line,
                            character: location.start.column
                        },
                        end: {
                            line: location.end.line,
                            character: location.end.column
                        }
                    },
                    message: error,
                    severity,
                    source
                };

                list.push(diagnostic);
            }

            return list;
        },
        []
    );

    conn.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

async function validateAll() {
    for (const document of docs.all()) {
        await validateTextDocument(document);
    }
}

docs.onDidChangeContent(change => {
    validateTextDocument(change.document);
});

conn.onDidChangeConfiguration(({ settings }: DidChangeConfigurationParams) => {
    conf = settings.example;
    validateAll();
});

docs.listen(conn);
conn.listen();
