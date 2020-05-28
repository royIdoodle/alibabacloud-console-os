import * as path from 'path';
import { mergeConfigs } from '@angular-builders/custom-webpack/dist/webpack-config-merger';
import WebpackChain from 'webpack-chain';
import webpackMerge from 'webpack-merge';
import { chainOsWebpack } from '@alicloud/console-toolkit-plugin-os';

const chain = new WebpackChain();

// remove plugin
function removePluginByName(plugins, name) {
  const pluginIndex = plugins.findIndex(plugin => plugin.constructor.name === name);
  if (pluginIndex > -1) {
    plugins.splice(pluginIndex, 1);
  }
}

const osAngularWebpack = (config) => {
  const singleSpaConfig = {
    output: {
      libraryTarget: 'umd',
    },
    externals: {
      'zone.js': 'Zone',
    },
    devServer: {
      historyApiFallback: false,
      contentBase: path.resolve(process.cwd(), 'src'),
      headers: {
        'Access-Control-Allow-Headers': '*',
      },
    },
  }

  const mergedConfig = webpackMerge.smart(config, singleSpaConfig)

  if (Array.isArray(mergedConfig.entry.styles)) {
    mergedConfig.entry.main = [...mergedConfig.entry.styles, ...mergedConfig.entry.main];
  }

  delete mergedConfig.entry['polyfills-es5'];
  delete mergedConfig.entry.styles;
  delete mergedConfig.optimization.runtimeChunk;
  delete mergedConfig.optimization.splitChunks;

  if (process.env.CONSOLE_OS_DEV_LOCAL ===  'true') {
    delete mergedConfig.entry.polyfills;
    removePluginByName(mergedConfig.plugins, 'IndexHtmlWebpackPlugin');
  } else {
    delete mergedConfig.externals['zone.js'];
  }

  return mergedConfig;
}

export default (userConfig = {}, options) => (config) => {
  const opts = {
    id: options.id
  };
  // @ts-ignore
  chainOsWebpack(opts)(chain)

  chain.plugin('WebpackAssetsManifestPlugin').tap((args) => {
    if (args[0]) {
      args[0].transform = function (manifest) {
        var entrypoints = manifest.entrypoints;
        var externals = []
        if (entrypoints && entrypoints.scripts) {
          externals = entrypoints.scripts.js
        }
        if (entrypoints) {
          delete manifest.entrypoints;
        }
        return {
          name: options.id,
          resources: manifest,
          externals: externals,
          entrypoints: entrypoints
        };
      }
    }
    return args;
  })

  return osAngularWebpack(
    mergeConfigs(
      mergeConfigs(config, userConfig, { 'module.rules': 'prepend' }, undefined),
      chain.toConfig(),
      { 'module.rules': 'prepend' },
      undefined
    )
  );
}