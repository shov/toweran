'use strict'

const fs = require('fs-extra')
const glob = require('glob')
const check = require('check-types')
const path = require('path')

/**
 * Reader of configuration files
 */
class ConfigReader {
  /**
   * Read a dir, looking for valid config files
   * (that return objects)
   * form and return config object
   * @param dir
   */
  readDir(dir) {
    try {
      fs.ensureDirSync(dir, 0o2775)
    } catch (e) {
      throw new Error(`Can't read the config, ${dir} is not available path to the config dir!`)
    }

    const config = {}

    glob.sync(`${dir}/*.js`).forEach(file => {
      const key = file.replace(/(.*)\/(.*)\.js$/, '$2')

      if (key.length === 0) {
        //wrong format, skip
        return
      }

      const branch = require(path.resolve(file))
      if(!check.object(branch)) {
        //wrong format, skip
        return
      }

      config[key] = branch
    })

    return config
  }
}

module.exports = ConfigReader
