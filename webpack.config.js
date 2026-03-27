const path = require("path");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const { ModuleFederationPlugin } = require("webpack").container;

module.exports = {
	...defaultConfig,

	entry: {
		app: path.resolve(__dirname, "assets/src/index.js"),
		profile: path.resolve(__dirname, "assets/src/profile/profile.js"),
		'mos-faq-block': path.resolve(__dirname, "assets/src/blocks/mos-faq/index.js"),
		'mos-faq-woocommerce': path.resolve(__dirname, "assets/src/woocommerce/index.js"),
	},

	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "assets/build"),
		publicPath: "auto",
	},

	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ["@babel/preset-env", "@babel/preset-react"],
					},
				},
			},
		],
	},

	plugins: [
		...defaultConfig.plugins,
		new ModuleFederationPlugin({
			name: "pluginstarter",
			remotes: {
				pluginstarterpro: `pluginstarterpro@/wp-content/plugins/mos-faqs-pro/build/pluginstarterprocomponents.js`,
			},
			shared: {
				react: { singleton: true, requiredVersion: false, eager: false },
				"react-dom": { singleton: true, requiredVersion: false, eager: false },
			},
		}),
	],
};
