/*
 * @Author: chenzhongsheng
 * @Date: 2023-08-05 14:18:12
 * @Description: Coding something
 */


const babelPluginReplaceTsExportAssignment = ({
    template,
}) => {
    const moduleExportsDeclaration = template(`
    module.exports = ASSIGNMENT;
  `);

    return {
        name: 'replace-ts-export-assignment',
        visitor: {
            TSExportAssignment (path) {
                path.replaceWith(
                    moduleExportsDeclaration({ASSIGNMENT: path.node.expression})
                );
            },
        },
    };
};

module.exports = babelPluginReplaceTsExportAssignment;