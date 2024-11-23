// scripts/generate-schema.js
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// Ensure NODE_ENV is set
const NODE_ENV = process.env.NODE_ENV || 'development'
const provider = NODE_ENV === 'production' ? 'postgresql' : 'sqlite'

const templatePath = path.join(process.cwd(), 'prisma/schema.template.prisma')
const outputPath = path.join(process.cwd(), 'prisma/schema.prisma')

const template = fs.readFileSync(templatePath, 'utf8')
const schema = template.replace('{{provider}}', provider)

fs.writeFileSync(outputPath, schema)

// In production, don't run prisma generate as it's handled by postinstall
if (NODE_ENV !== 'production') {
    execSync('prisma generate', { stdio: 'inherit' })
}

console.log(`Generated Prisma schema for ${provider} (${NODE_ENV} environment)`)
