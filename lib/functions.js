const cfonts = require("cfonts")

const banner = cfonts.render(('ALICE|MD'), {
    font: 'block',
    color: 'red',
    align: 'center',
    gradient: ["red","white"],
    lineHeight: 3
    })
    module.exports = {
  banner
    }