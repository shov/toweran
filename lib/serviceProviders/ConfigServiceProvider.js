'use strict'

const BasicServiceProvider = toweran.BasicServiceProvider

/**
 * Service provider to handle events stuff
 * @property {ContainerInterface} _container
 */
class ConfigServiceProvider extends BasicServiceProvider {
    register() {
        this._container.register('configManager', toweran.ConfigManager)
            .dependencies('config')
    }

    boot() {
    }
}

module.exports = ConfigServiceProvider
