import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslintEslintPlugin from "@typescript-eslint/eslint-plugin";
import sonarjs from "eslint-plugin-sonarjs";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores([
    "**/.eslintrc.js",
    "**/output",
    "**/coverage",
    "**/reports",
    "**/dist",
    "**/module",
    "**/node_modules",
    "**/*.d.ts",
    "**/*.d.js",
    "**/*.js",
    "**/public",
    "**/*.config.js",
    "**/*.json",
]), {
    extends: compat.extends(
        "eslint:recommended",
        "airbnb-base",
        "airbnb-typescript/base",
        "plugin:sonarjs/recommended-legacy",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:prettier/recommended",
        "prettier",
    ),

    plugins: {
        "@typescript-eslint": typescriptEslintEslintPlugin,
        sonarjs,
        "unused-imports": unusedImports,
    },

    languageOptions: {
        globals: {
            ...globals.node,
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "tsconfig.json",
            tsconfigRootDir: __dirname,
        },
    },

    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "class-methods-use-this": "off",
        "consistent-return": "off",
        "func-names": "off",
        "newline-per-chained-call": "off",
        "no-await-in-loop": "off",
        "no-continue": "off",

        "no-param-reassign": ["error", {
            props: false,
        }],

        "no-restricted-syntax": ["error", "ForInStatement", "LabeledStatement", "WithStatement"],

        "no-underscore-dangle": ["error", {
            allow: ["_id"],
        }],

        "no-void": ["error", {
            allowAsStatement: true,
        }],

        "object-curly-newline": "off",

        "spaced-comment": ["error", "always", {
            line: {
                markers: ["/", "#region", "#endregion"],
            },
        }],

        "lines-between-class-members": ["error", "always", {
            exceptAfterSingleLine: true,
        }],

        "no-dupe-class-members": "off",
        "no-duplicate-imports": "off",
        "no-loop-func": "off",
        "no-return-await": "off",
        "no-unused-expressions": "off",
        "object-curly-spacing": "off",
        "max-classes-per-file": "off",
        "import/named": "off",
        "import/no-default-export": "error",

        "import/order": ["error", {
            groups: [["builtin", "external", "internal"]],
            "newlines-between": "always",

            alphabetize: {
                order: "asc",
                caseInsensitive: true,
            },
        }],

        "import/prefer-default-export": "off",
        "import/extensions": "off",
        "@typescript-eslint/consistent-indexed-object-style": "error",

        "@typescript-eslint/consistent-type-assertions": ["error", {
            assertionStyle: "angle-bracket",
        }],

        "@typescript-eslint/lines-between-class-members": ["error", "always", {
            exceptAfterSingleLine: true,
        }],

        "@typescript-eslint/member-delimiter-style": "error",
        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/no-dupe-class-members": "error",
        "@typescript-eslint/no-duplicate-imports": "off",

        "@typescript-eslint/no-floating-promises": ["error", {
            ignoreIIFE: true,
            ignoreVoid: true,
        }],

        "@typescript-eslint/no-inferrable-types": ["error", {
            ignoreParameters: true,
            ignoreProperties: true,
        }],

        "@typescript-eslint/no-loop-func": "error",

        "@typescript-eslint/no-misused-promises": ["error", {
            checksVoidReturn: false,
        }],

        "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
        "@typescript-eslint/no-unnecessary-condition": "error",
        "@typescript-eslint/no-unnecessary-qualifier": "error",
        "@typescript-eslint/no-unnecessary-type-arguments": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "off",
        "@typescript-eslint/no-unnecessary-type-constraint": "error",
        "@typescript-eslint/no-unsafe-assignment": "off",
        "@typescript-eslint/no-unsafe-member-access": "off",
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/object-curly-spacing": ["error", "always"],
        "@typescript-eslint/prefer-includes": "off",
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/return-await": "error",
        "@typescript-eslint/no-base-to-string": "off",
        "@typescript-eslint/no-unsafe-enum-comparison": "off",

        "@typescript-eslint/typedef": ["error", {
            memberVariableDeclaration: true,
            parameter: true,
            propertyDeclaration: true,
        }],

        "@typescript-eslint/unbound-method": ["error", {
            ignoreStatic: true,
        }],

        "sonarjs/no-duplicate-string": "off",
        "unused-imports/no-unused-imports": "error",

        "unused-imports/no-unused-vars": ["warn", {
            vars: "all",
            varsIgnorePattern: "^_",
            args: "after-used",
            argsIgnorePattern: "^_",
        }],

        "@typescript-eslint/naming-convention": ["warn", {
            selector: "default",
            format: ["strictCamelCase"],
        }, {
            selector: "variable",
            format: ["strictCamelCase", "UPPER_CASE", "StrictPascalCase"],
        }, {
            selector: "parameter",
            modifiers: ["unused"],
            format: ["strictCamelCase"],
            leadingUnderscore: "allow",
        }, {
            selector: "property",
            format: null,
        }, {
            selector: "typeProperty",
            format: null,
        }, {
            selector: "typeLike",
            format: ["StrictPascalCase"],
        }, {
            selector: "enumMember",
            format: ["UPPER_CASE"],
        }],
    },
}]);