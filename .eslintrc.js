module.exports = {
	"env": {
		"es6": true,
		"node": true
	},
	"extends": [
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking"
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"project": "tsconfig.json",
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint",
		"@typescript-eslint/tslint"
	],
	"rules": {
		"@typescript-eslint/restrict-template-expressions": "off"
	}
};
