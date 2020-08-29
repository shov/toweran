module.exports = {

  "parser":"babel-eslint",

  "parserOptions": {
    "ecmaVersion": 8,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
    }
  },
  
  "env": {
    "node": true,
    "jest": true,
    "es2017": true,
  },

  "rules": {
    "semi": ["error", "never"]
  },
}