module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:react/recommended"
	],
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"react"
	],
	"rules": {
		"no-unused-vars": [
			"warn"
		],
		"indent": [
			"warn",
			"tab"
		],
		"linebreak-style": [
			"warn",
			"unix"
		],
		"quotes": [
			"warn",
			"double"
		],
		"semi": [
			"warn",
			"never"
		],
		"react/prop-types": [
			"warn"
		],
		"react/react-in-jsx-scope": [
			"off"
		],
		"no-undef": [
			"off"
		],
		"no-mixed-spaces-and-tabs": [
			"off"
		]
	}
}
