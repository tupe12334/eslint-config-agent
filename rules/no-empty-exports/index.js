// Rule to prevent export { } statements of any length

const selector =
  'ExportNamedDeclaration:not([source]):not(:has(VariableDeclaration)):not(:has(FunctionDeclaration)):not(:has(ClassDeclaration)):not(:has(TSInterfaceDeclaration)):not(:has(TSTypeAliasDeclaration)):not(:has(TSEnumDeclaration))'
const message =
  'Export specifier syntax "export { ... }" is not allowed. Use direct exports instead. And make sure to only use one export per file.'

const rule = {
  selector,
  message,
}

const noExportSpecifiersConfig = {
  selector,
  message,
}

export { rule, selector, message, noExportSpecifiersConfig }
