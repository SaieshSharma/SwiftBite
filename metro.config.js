const { getDefaultConfig } = require("@expo/metro-config");
const { getSentryExpoConfig } = require("@sentry/react-native/metro");
const { withNativeWind } = require("nativewind/metro");

let config = getDefaultConfig(__dirname);

// ✅ Add custom extensions or asset plugins here
config.resolver.assetExts.push("hcscript");
config.transformer.assetPlugins = ["expo-asset/tools/hashAssetFiles"];


// ✅ Wrap with Sentry first (needed for source maps and symbolication)
config = getSentryExpoConfig(__dirname, config);

// ✅ Then wrap with NativeWind
config = withNativeWind(config, { input: "./app/global.css" });

module.exports = config;
