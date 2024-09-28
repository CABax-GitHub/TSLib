import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jasmine from "eslint-plugin-jasmine";
import stylistic from "@stylistic/eslint-plugin";

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.spec.{js,ts}"],
    plugins: {
      jasmine: jasmine
    },
    languageOptions: {
      globals: {
        ...globals.jasmine // Use globals.jasmine instead of jasmine.environments.jasmine.globals
      }
    },
    rules: {
      ...jasmine.configs.recommended.rules
    }
  },
  {
    ignores: [
      "**/.angular/**",
      "**/.idea/**",
      "**/.vscode/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/public/**",
      "**/reports/**",
      "**/eslint.config.mjs",
      "**/karma.conf.js",
      "**/src/**/*.js",
      "**/TSDocumenter.js",
    ],
  },  
  {
    plugins: {
      '@stylistic': stylistic
    },
    rules: {
      // see: https://eslint.style/packages/default                                      // These all are deprecated in eslint => use @stylistic
      "@stylistic/max-len": ["warn", { code: 100, ignoreComments: true }],               // Warn if lines are longer than 100 characters and exclude comments (default = 80, false)
      "@stylistic/semi": ["error", "always"],                                            // Enforce semicolons at the end of statements (default)
      "@stylistic/quotes": ["error", "double"],                                          // Enforce double quotes (default)
      "@stylistic/indent": ["error", 2],                                                 // Enforce indent of 2 spaces (default)
      "@stylistic/no-trailing-spaces": ["error"],                                        // Disallow trailing whitespace at the end of lines (default)
      "@stylistic/eol-last": ["error", "always"],                                        // Enforce newline at the end of files (default)
      "@stylistic/no-multiple-empty-lines": ["error", { "max": 1 }],                     // Disallow multiple empty lines (default)
      "@stylistic/brace-style": ["error", "1tbs", { "allowSingleLine": true }],          // Enforce consistent brace style for blocks, allows on single line (default = false)
      "@stylistic/comma-dangle": ["error", "always-multiline"],                          // Enforce or disallow trailing commas (default)
      "@stylistic/arrow-parens": ["error", "always"],                                    // Enforce parentheses around arrow function parameters (default)
      "@stylistic/space-before-function-paren": ["error", "never"],                      // Enforce consistent spacing before function parentheses (default)
      "@stylistic/object-curly-spacing": ["error", "always"],                            // Enforce consistent spacing inside braces (default)
      "@stylistic/array-bracket-spacing": ["error", "never"],                            // Enforce consistent spacing inside array brackets (default)
      "@stylistic/key-spacing": ["error", { "beforeColon": false, "afterColon": true }], // Enforce consistent spacing between keys and values in object literals (default)
      "@stylistic/comma-spacing": ["error", { "before": false, "after": true }],         // Enforce consistent spacing before and after commas (default)
      "@stylistic/keyword-spacing": ["error", {"before": true, "after": true}],          // Enforce consistent spacing before and after keywords (default)
      "@stylistic/arrow-spacing": ["error", {"before": true, "after": true}],            // Enforce consistent spacing before and after the arrow in arrow functions (default)
      // optional rules
      "array-callback-return": ["warn"],       // Enforce return in array methods (default)
      "block-scoped-var": ["warn"],            // Enforce block scoped var (default)
      "callback-return": ["warn"],             // Enforce return after a callback (default)
      "complexity": ["warn"],                  // Enforce complexity (default)
      "default-case": ["warn"],                // Enforce default case (default)
      "dot-location": ["warn"],                // Enforce dot location (default)
      "dot-notation": ["warn"],                // Enforce dot notation (default)
      "eqeqeq": ["warn"],                      // Enforce eqeqeq (default)
      "global-require": ["warn"],              // Enforce require() on top-level module scope (default)
      "guard-for-in": ["warn"],                // Enforce guard for in (default)
      "handle-callback-err": ["warn"],         // Enforce handling of callback errors (default)
      "init-declarations": ["warn", "always"], // Require variable declarations to be initialized (default)
      "no-alert": ["warn"],                    // Disallow alert (default)
      "no-buffer-constructor": ["warn"],       // Disallow Buffer() (default)
      "no-caller": ["warn"],                   // Disallow caller (default)
      "no-case-declarations": ["warn"],        // Disallow case declarations (default)
      "no-catch-shadow": ["warn"],             // Disallow catch clause parameters from shadowing variables in the outer scope (default)
      "no-console": ["warn"],                  // Disallow console (default)
      "no-debugger": ["warn"],                 // Disallow debugger (default)
      "no-delete-var": ["warn"],               // Disallow delete var (default)
      "no-div-regex": ["warn"],                // Disallow div regex (default)
      "no-else-return": ["warn"],              // Disallow else return (default)
      "no-empty-function": ["warn"],           // Disallow empty function (default)
      "no-empty-pattern": ["warn"],            // Disallow empty pattern (default)
      "no-eq-null": ["warn"],                  // Disallow eq null (default)
      "no-eval": ["warn"],                     // Disallow eval (default)
      "no-extend-native": ["warn"],            // Disallow extend native and extending native objects (default)
      "no-extra-bind": ["warn"],               // Disallow extra bind and unnecessary function binding (default)
      "no-extra-label": ["warn"],              // Disallow extra label (default)
      "no-extra-semi": ["warn"],               // Disallow unnecessary semicolons (default)
      "no-fallthrough": ["warn"],              // Disallow fallthrough and fallthrough of case statements (default)
      "no-floating-decimal": ["warn"],         // Disallow floating decimals (default)
      "no-implicit-coercion": ["warn"],        // Disallow implicit type conversion (default)
      "no-implied-eval": ["warn"],             // Disallow implied eval (default)
      "no-invalid-this": ["warn"],             // Disallow this keywords outside of classes or class-like objects (default)
      "no-iterator": ["warn"],                 // Disallow __iterator__ (default)
      "no-label-var": ["warn"],                // Disallow labels that share a name with a variable (default)
      "no-lone-blocks": ["warn"],              // Disallow unnecessary nested blocks (default)
      "no-loop-func": ["warn"],                // Disallow function declarations and expressions inside loop statements (default)
      "no-mixed-requires": ["warn"],           // Disallow mixed requires (default)
      "no-multi-spaces": ["warn"],             // Disallow multiple spaces (default)
      "no-multi-str": ["warn"],                // Disallow multiline strings (default)
      "no-new": ["warn"],                      // Disallow new for side effects (default)
      "no-new-func": ["warn"],                 // Disallow new Function (default)
      "no-new-require": ["warn"],              // Disallow new require (default)
      "no-new-wrappers": ["warn"],             // Disallow new for wrapper objects (default)
      "no-octal": ["warn"],                    // Disallow octal literals (default)
      "no-octal-escape": ["warn"],             // Disallow octal escape sequences in strings (default)
      "no-param-reassign": ["warn"],           // Disallow reassigning function parameters (default)
      "no-path-concat": ["warn"],              // Disallow string concatenation with __dirname and __filename (default)
      "no-process-env": ["warn"],              // Disallow process.env (default)
      "no-process-exit": ["warn"],             // Disallow process.exit() (default)
      "no-proto": ["warn"],                    // Disallow __proto__ (default)
      "no-redeclare": ["warn"],                // Disallow variable redeclaration (default)
      "no-restricted-modules": ["warn"],       // Disallow specified modules (default)
      "no-return-assign": ["warn"],            // Disallow assignment operators in return statements (default)
      "no-script-url": ["warn"],               // Disallow script urls (default)
      "no-self-compare": ["warn"],             // Disallow self compare (default)
      "no-sequences": ["warn"],                // Disallow comma operators (default)
      "no-shadow": ["warn"],                   // Disallow variable declarations from shadowing variables declared in the outer scope (default)
      "no-shadow-restricted-names": ["warn"],  // Disallow shadowing of restricted names (default)
      "no-sync": ["warn"],                     // Disallow synchronous methods (default)
      "no-throw-literal": ["warn"],            // Disallow throwing literals as exceptions (default)
      "no-undefined": ["warn"],                // Disallow undefined (default)
      "no-unused-expressions": ["warn"],       // Disallow unused expressions (default)
      "no-unused-vars": ["warn"],              // Disallow unused variables (default)
      "no-use-before-define": ["warn"],        // Disallow use before define (default)
      "no-useless-call": ["warn"],             // Disallow unnecessary call (default)
      "no-useless-concat": ["warn"],           // Disallow unnecessary concatenation (default)
      "no-var": ["warn"],                      // Disallow var, use let or const instead (default)
      "no-void": ["warn"],                     // Disallow void (default)
      "no-with": ["warn"],                     // Disallow with (default)
      "prefer-regex-literals": ["warn"],       // Prefer regex literals (default)
      "radix": ["warn"],                       // Enforce radix (default)
      "require-await": ["warn"],               // Require await (default)
      "strict": ["warn", "global"],            // Require strict mode (default)
      "valid-typeof": ["warn"],                // Validate typeof (default)
      "vars-on-top": ["warn"],                 // Require var declarations be placed at the top of their containing scope (default)
      "wrap-iife": ["warn"],                   // Require parentheses around immediately invoked function expressions (default)
      "yoda": ["warn"],                        // Enforce yoda conditions (default)      
    }
  },
  {
    rules: {
      // standard eslint - errors
      "eqeqeq": ["error", "always"],                 // Enforce the use of === and !==
      "curly": ["error", "all"],                     // Enforce consistent brace style
      "no-unused-vars": ["error"],                   // Disallow unused variables
      "no-undef": ["error"],                         // Disallow the use of undeclared variables
      "prefer-const": ["error"],                     // Require const declarations for variables that are never reassigned
      "no-constructor-return": ["error"],            // Disallow returning value from constructor
      "no-lonely-if": ["error"],                     // Disallow if statements as the only statement in an else block
      "consistent-return": ["error"],                // Enforce consistent return values in functions

      // standard eslint - warnings
      "capitalized-comments": ["warn", "always"],    // Enforce or disallow capitalization of the first letter of a comment
      "max-depth": ["warn", 5],                      // Enforce a maximum depth that blocks can be nested
      "max-params": ["warn", 6],                     // Enforce a maximum number of parameters in function definitions
      "max-lines-per-function": ["warn", 50],        // Enforce a maximum number of lines of code in a function
    }
  }
];
