// Copyright 2022 Kate Ward <kate@dariox.club> (https://kate.pet).
// SPDX-License-Identifier: 	AGPL-3.0-or-later

const fs = require('fs')

const package = require('./package.json')

let content =
`export interface IPackageInfo
{
    name: string
    version: string
    author: string
    license: string
    _buildtimestamp: number
}
export const PackageInfo: IPackageInfo = {
    name: "${package.name}",
    version: "${package.version}",
    author: "${package.author}",
    license: "${package.license}",
    _buildtimestamp: ${Date.now()}
}`

fs.unlinkSync('./src/_PACKAGE.ts')
fs.writeFileSync('./src/_PACKAGE.ts', content)