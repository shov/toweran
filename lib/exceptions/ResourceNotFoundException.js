'use strict'

/**
 * An alias for more general NotFound, will cause 404 for HTTP
 * However can mean not only HTTP resource but anything
 */
class ResourceNotFoundException extends toweran.NotFoundException {

}

module.exports = ResourceNotFoundException