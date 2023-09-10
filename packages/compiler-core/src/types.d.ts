/*
 * @Author: chenzhongsheng
 * @Date: 2023-07-11 14:29:40
 * @Description: Coding something
 */

import * as Type from '@babel/types';

export type IBabelType = typeof Type;

type INodeTypeMap = {
    [Key in Type.Node['type']]?: 1;
}

declare module '@babel/types' {
    // 这里拿不到 Node 的基类 BaseNode, 只能重写所有上层类
    // Node 也是 type，无法扩展
    interface CommonNode {
        _isReplace?: boolean; // 是否是完全赋值 const a=b;
        _isForUpdate?: boolean; // 是否是for循环的初始化_isCtx
        _shouldRemoved?: boolean; // 是否需要标记在exit时删除node
        _importReactive?: '' | '*' | string[]; // import 语句标记是否是reactive
        _isComReact?: boolean; // 是否标记为reactive
        _isComStatic?: boolean; // 是否标记为static
        _isShallow?: boolean; // 是否是浅reactive
        _handled?: boolean; // 是否已经被处理过
        _isReactive?: boolean; // 是否标记为响应数据
        _fnArg?: boolean; // 是否是函数参数
        _isStaticScope?: boolean; // 是否是static作用域
    }

    interface AnyTypeAnnotation extends CommonNode {}
    interface ArgumentPlaceholder extends CommonNode {}
    interface ArrayExpression extends CommonNode {}
    interface ArrayPattern extends CommonNode {}
    interface ArrayTypeAnnotation extends CommonNode {}
    interface ArrowFunctionExpression extends CommonNode {}
    interface AssignmentExpression extends CommonNode {}
    interface AssignmentPattern extends CommonNode {}
    interface AwaitExpression extends CommonNode {}
    interface BigIntLiteral extends CommonNode {}
    interface BinaryExpression extends CommonNode {}
    interface BindExpression extends CommonNode {}
    interface BlockStatement extends CommonNode {}
    interface BooleanLiteral extends CommonNode {}
    interface BooleanLiteralTypeAnnotation extends CommonNode {}
    interface BooleanTypeAnnotation extends CommonNode {}
    interface BreakStatement extends CommonNode {}
    interface CallExpression extends CommonNode {}
    interface CatchClause extends CommonNode {}
    interface ClassAccessorProperty extends CommonNode {}
    interface ClassBody extends CommonNode {}
    interface ClassDeclaration extends CommonNode {}
    interface ClassExpression extends CommonNode {}
    interface ClassImplements extends CommonNode {}
    interface ClassMethod extends CommonNode {}
    interface ClassPrivateMethod extends CommonNode {}
    interface ClassPrivateProperty extends CommonNode {}
    interface ClassProperty extends CommonNode {}
    interface ConditionalExpression extends CommonNode {}
    interface ContinueStatement extends CommonNode {}
    interface DebuggerStatement extends CommonNode {}
    interface DecimalLiteral extends CommonNode {}
    interface DeclareClass extends CommonNode {}
    interface DeclareExportAllDeclaration extends CommonNode {}
    interface DeclareExportDeclaration extends CommonNode {}
    interface DeclareFunction extends CommonNode {}
    interface DeclareInterface extends CommonNode {}
    interface DeclareModule extends CommonNode {}
    interface DeclareModuleExports extends CommonNode {}
    interface DeclareOpaqueType extends CommonNode {}
    interface DeclareTypeAlias extends CommonNode {}
    interface DeclareVariable extends CommonNode {}
    interface DeclaredPredicate extends CommonNode {}
    interface Decorator extends CommonNode {}
    interface Directive extends CommonNode {}
    interface DirectiveLiteral extends CommonNode {}
    interface DoExpression extends CommonNode {}
    interface DoWhileStatement extends CommonNode {}
    interface EmptyStatement extends CommonNode {}
    interface EmptyTypeAnnotation extends CommonNode {}
    interface EnumBooleanBody extends CommonNode {}
    interface EnumBooleanMember extends CommonNode {}
    interface EnumDeclaration extends CommonNode {}
    interface EnumDefaultedMember extends CommonNode {}
    interface EnumNumberBody extends CommonNode {}
    interface EnumNumberMember extends CommonNode {}
    interface EnumStringBody extends CommonNode {}
    interface EnumStringMember extends CommonNode {}
    interface EnumSymbolBody extends CommonNode {}
    interface ExistsTypeAnnotation extends CommonNode {}
    interface ExportAllDeclaration extends CommonNode {}
    interface ExportDefaultDeclaration extends CommonNode {}
    interface ExportDefaultSpecifier extends CommonNode {}
    interface ExportNamedDeclaration extends CommonNode {}
    interface ExportNamespaceSpecifier extends CommonNode {}
    interface ExportSpecifier extends CommonNode {}
    interface ExpressionStatement extends CommonNode {}
    interface File extends CommonNode {}
    interface ForInStatement extends CommonNode {}
    interface ForOfStatement extends CommonNode {}
    interface ForStatement extends CommonNode {}
    interface FunctionDeclaration extends CommonNode {}
    interface FunctionExpression extends CommonNode {}
    interface FunctionTypeAnnotation extends CommonNode {}
    interface FunctionTypeParam extends CommonNode {}
    interface GenericTypeAnnotation extends CommonNode {}
    interface Identifier extends CommonNode {}
    interface IfStatement extends CommonNode {}
    interface Import extends CommonNode {}
    interface ImportAttribute extends CommonNode {}
    interface ImportDeclaration extends CommonNode {}
    interface ImportDefaultSpecifier extends CommonNode {}
    interface ImportNamespaceSpecifier extends CommonNode {}
    interface ImportSpecifier extends CommonNode {}
    interface IndexedAccessType extends CommonNode {}
    interface InferredPredicate extends CommonNode {}
    interface InterfaceDeclaration extends CommonNode {}
    interface InterfaceExtends extends CommonNode {}
    interface InterfaceTypeAnnotation extends CommonNode {}
    interface InterpreterDirective extends CommonNode {}
    interface IntersectionTypeAnnotation extends CommonNode {}
    interface JSXAttribute extends CommonNode {}
    interface JSXClosingElement extends CommonNode {}
    interface JSXClosingFragment extends CommonNode {}
    interface JSXElement extends CommonNode {}
    interface JSXEmptyExpression extends CommonNode {}
    interface JSXExpressionContainer extends CommonNode {}
    interface JSXFragment extends CommonNode {}
    interface JSXIdentifier extends CommonNode {}
    interface JSXMemberExpression extends CommonNode {}
    interface JSXNamespacedName extends CommonNode {}
    interface JSXOpeningElement extends CommonNode {}
    interface JSXOpeningFragment extends CommonNode {}
    interface JSXSpreadAttribute extends CommonNode {}
    interface JSXSpreadChild extends CommonNode {}
    interface JSXText extends CommonNode {}
    interface LabeledStatement extends CommonNode {}
    interface LogicalExpression extends CommonNode {}
    interface MemberExpression extends CommonNode {}
    interface MetaProperty extends CommonNode {}
    interface MixedTypeAnnotation extends CommonNode {}
    interface ModuleExpression extends CommonNode {}
    interface NewExpression extends CommonNode {}
    interface Noop extends CommonNode {}
    interface NullLiteral extends CommonNode {}
    interface NullLiteralTypeAnnotation extends CommonNode {}
    interface NullableTypeAnnotation extends CommonNode {}
    interface NumberLiteral$1 extends CommonNode {}
    interface NumberLiteralTypeAnnotation extends CommonNode {}
    interface NumberTypeAnnotation extends CommonNode {}
    interface NumericLiteral extends CommonNode {}
    interface ObjectExpression extends CommonNode {}
    interface ObjectMethod extends CommonNode {}
    interface ObjectPattern extends CommonNode {}
    interface ObjectProperty extends CommonNode {}
    interface ObjectTypeAnnotation extends CommonNode {}
    interface ObjectTypeCallProperty extends CommonNode {}
    interface ObjectTypeIndexer extends CommonNode {}
    interface ObjectTypeInternalSlot extends CommonNode {}
    interface ObjectTypeProperty extends CommonNode {}
    interface ObjectTypeSpreadProperty extends CommonNode {}
    interface OpaqueType extends CommonNode {}
    interface OptionalCallExpression extends CommonNode {}
    interface OptionalIndexedAccessType extends CommonNode {}
    interface OptionalMemberExpression extends CommonNode {}
    interface ParenthesizedExpression extends CommonNode {}
    interface PipelineBareFunction extends CommonNode {}
    interface PipelinePrimaryTopicReference extends CommonNode {}
    interface PipelineTopicExpression extends CommonNode {}
    interface Placeholder extends CommonNode {}
    interface PrivateName extends CommonNode {}
    interface Program extends CommonNode {}
    interface QualifiedTypeIdentifier extends CommonNode {}
    interface RecordExpression extends CommonNode {}
    interface RegExpLiteral extends CommonNode {}
    interface RegexLiteral$1 extends CommonNode {}
    interface RestElement extends CommonNode {}
    interface RestProperty$1 extends CommonNode {}
    interface ReturnStatement extends CommonNode {}
    interface SequenceExpression extends CommonNode {}
    interface SpreadElement extends CommonNode {}
    interface SpreadProperty$1 extends CommonNode {}
    interface StaticBlock extends CommonNode {}
    interface StringLiteral extends CommonNode {}
    interface StringLiteralTypeAnnotation extends CommonNode {}
    interface StringTypeAnnotation extends CommonNode {}
    interface Super extends CommonNode {}
    interface SwitchCase extends CommonNode {}
    interface SwitchStatement extends CommonNode {}
    interface SymbolTypeAnnotation extends CommonNode {}
    interface TSAnyKeyword extends CommonNode {}
    interface TSArrayType extends CommonNode {}
    interface TSAsExpression extends CommonNode {}
    interface TSBigIntKeyword extends CommonNode {}
    interface TSBooleanKeyword extends CommonNode {}
    interface TSCallSignatureDeclaration extends CommonNode {}
    interface TSConditionalType extends CommonNode {}
    interface TSConstructSignatureDeclaration extends CommonNode {}
    interface TSConstructorType extends CommonNode {}
    interface TSDeclareFunction extends CommonNode {}
    interface TSDeclareMethod extends CommonNode {}
    interface TSEnumDeclaration extends CommonNode {}
    interface TSEnumMember extends CommonNode {}
    interface TSExportAssignment extends CommonNode {}
    interface TSExpressionWithTypeArguments extends CommonNode {}
    interface TSExternalModuleReference extends CommonNode {}
    interface TSFunctionType extends CommonNode {}
    interface TSImportEqualsDeclaration extends CommonNode {}
    interface TSImportType extends CommonNode {}
    interface TSIndexSignature extends CommonNode {}
    interface TSIndexedAccessType extends CommonNode {}
    interface TSInferType extends CommonNode {}
    interface TSInstantiationExpression extends CommonNode {}
    interface TSInterfaceBody extends CommonNode {}
    interface TSInterfaceDeclaration extends CommonNode {}
    interface TSIntersectionType extends CommonNode {}
    interface TSIntrinsicKeyword extends CommonNode {}
    interface TSLiteralType extends CommonNode {}
    interface TSMappedType extends CommonNode {}
    interface TSMethodSignature extends CommonNode {}
    interface TSModuleBlock extends CommonNode {}
    interface TSModuleDeclaration extends CommonNode {}
    interface TSNamedTupleMember extends CommonNode {}
    interface TSNamespaceExportDeclaration extends CommonNode {}
    interface TSNeverKeyword extends CommonNode {}
    interface TSNonNullExpression extends CommonNode {}
    interface TSNullKeyword extends CommonNode {}
    interface TSNumberKeyword extends CommonNode {}
    interface TSObjectKeyword extends CommonNode {}
    interface TSOptionalType extends CommonNode {}
    interface TSParameterProperty extends CommonNode {}
    interface TSParenthesizedType extends CommonNode {}
    interface TSPropertySignature extends CommonNode {}
    interface TSQualifiedName extends CommonNode {}
    interface TSRestType extends CommonNode {}
    interface TSSatisfiesExpression extends CommonNode {}
    interface TSStringKeyword extends CommonNode {}
    interface TSSymbolKeyword extends CommonNode {}
    interface TSThisType extends CommonNode {}
    interface TSTupleType extends CommonNode {}
    interface TSTypeAliasDeclaration extends CommonNode {}
    interface TSTypeAnnotation extends CommonNode {}
    interface TSTypeAssertion extends CommonNode {}
    interface TSTypeLiteral extends CommonNode {}
    interface TSTypeOperator extends CommonNode {}
    interface TSTypeParameter extends CommonNode {}
    interface TSTypeParameterDeclaration extends CommonNode {}
    interface TSTypeParameterInstantiation extends CommonNode {}
    interface TSTypePredicate extends CommonNode {}
    interface TSTypeQuery extends CommonNode {}
    interface TSTypeReference extends CommonNode {}
    interface TSUndefinedKeyword extends CommonNode {}
    interface TSUnionType extends CommonNode {}
    interface TSUnknownKeyword extends CommonNode {}
    interface TSVoidKeyword extends CommonNode {}
    interface TaggedTemplateExpression extends CommonNode {}
    interface TemplateElement extends CommonNode {}
    interface TemplateLiteral extends CommonNode {}
    interface ThisExpression extends CommonNode {}
    interface ThisTypeAnnotation extends CommonNode {}
    interface ThrowStatement extends CommonNode {}
    interface TopicReference extends CommonNode {}
    interface TryStatement extends CommonNode {}
    interface TupleExpression extends CommonNode {}
    interface TupleTypeAnnotation extends CommonNode {}
    interface TypeAlias extends CommonNode {}
    interface TypeAnnotation extends CommonNode {}
    interface TypeCastExpression extends CommonNode {}
    interface TypeParameter extends CommonNode {}
    interface TypeParameterDeclaration extends CommonNode {}
    interface TypeParameterInstantiation extends CommonNode {}
    interface TypeofTypeAnnotation extends CommonNode {}
    interface UnaryExpression extends CommonNode {}
    interface UnionTypeAnnotation extends CommonNode {}
    interface UpdateExpression extends CommonNode {}
    interface V8IntrinsicIdentifier extends CommonNode {}
    interface VariableDeclaration extends CommonNode {}
    interface VariableDeclarator extends CommonNode {}
    interface Variance extends CommonNode {}
    interface VoidTypeAnnotation extends CommonNode {}
    interface WhileStatement extends CommonNode {}
    interface WithStatement extends CommonNode {}
    interface YieldExpression extends CommonNode {}
    type AlinsNode = Type.Node & CommonNode;
}

// declare module '@babel/traverse' {
//     interface BaseNode {
//         _importReactive: any;
//     }
// }