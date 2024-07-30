import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

export default {
    input: 'index.js',
    output: {
        dir: 'build',
        format: 'cjs',
    },
    plugins: [
        commonjs(),
        nodeResolve(),
        json()
    ]
};
