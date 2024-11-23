import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// Ensure NODE_ENV is set
const NODE_ENV = process.env.NODE_ENV || 'development'
const provider = NODE_ENV === 'production' ? 'postgresql' : 'sqlite'

const templatePath = path.join(process.cwd(), 'prisma/schema.template.prisma')
const outputPath = path.join(process.cwd(), 'prisma/schema.prisma')

const template = fs.readFileSync(templatePath, 'utf8')
const schema = template.replace('{{provider}}', provider)

fs.writeFileSync(outputPath, schema)

// Regenerate Prisma Client
execSync('prisma generate', { stdio: 'inherit' })

console.log(`Generated Prisma schema for ${provider} (${NODE_ENV} environment)`)
