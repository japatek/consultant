#!/usr/bin/env node

/**
 * Database Clear Data Script
 * * This script deletes all data from the database while preserving the schema.
 * Use this for development to start with a clean database (keeps schema intact).
 * * Run: npm run db:clear
 */

import 'dotenv/config'
import { prisma } from '../../website/src/lib/prisma'

async function main() {
  try {
    // console.log(' Starting database data clear...')
    // console.log('  This will DELETE ALL DATA from the database (schema preserved)')

    // ==========================================
    // 1. DELETE ALL MESSAGES (PLATFORM SPECIFIC)
    // ==========================================
    // console.log('  Deleting messages from all platforms...')
    
    // CATATAN: Jika Prisma mendeteksi nama model Anda sebagai camelCase otomatis, 
    // ubah menjadi: prisma.messageBrowserExt, prisma.messageWebsite, dll.
    await prisma.message_BrowserExt.deleteMany({})
    await prisma.message_Website.deleteMany({})
    await prisma.message_OfficeExt.deleteMany({})
    await prisma.message_InventorExt.deleteMany({})
    await prisma.message_SolidworksExt.deleteMany({})

    // const msgBrowserCount = await prisma.message_BrowserExt.count()
    // const msgWebsiteCount = await prisma.message_Website.count()
    // const msgOfficeCount = await prisma.message_OfficeExt.count()
    // const msgInventorCount = await prisma.message_InventorExt.count()
    // const msgSolidworksCount = await prisma.message_SolidworksExt.count()
    
    // console.log(` Messages cleared:`)
    // console.log(`   - Browser Extension: ${msgBrowserCount} remaining`)
    // console.log(`   - Website: ${msgWebsiteCount} remaining`)
    // console.log(`   - Office Extension: ${msgOfficeCount} remaining`)

    // ==========================================
    // 2. DELETE ALL CHAT SESSIONS (PLATFORM SPECIFIC)
    // ==========================================
    // console.log('\n  Deleting chat sessions from all platforms...')
    await prisma.chatSession_BrowserExt.deleteMany({})
    await prisma.chatSession_Website.deleteMany({})
    await prisma.chatSession_OfficeExt.deleteMany({})
    await prisma.chatSession_SolidworksExt.deleteMany({})
    await prisma.chatSession_InventorExt.deleteMany({})

    // const sessionBrowserCount = await prisma.chatSession_BrowserExt.count()
    // const sessionWebsiteCount = await prisma.chatSession_Website.count()
    // const sessionOfficeCount = await prisma.chatSession_OfficeExt.count()

    // console.log(` Chat sessions cleared:`)
    // console.log(`   - Browser Extension: ${sessionBrowserCount} remaining`)
    // console.log(`   - Website: ${sessionWebsiteCount} remaining`)
    // console.log(`   - Office Extension: ${sessionOfficeCount} remaining`)

    // ==========================================
    // 3. DELETE USERS
    // ==========================================
    // console.log('\n  Deleting users...')
    await prisma.user.deleteMany({})
    // const userCount = await prisma.user.count()
    // console.log(` Users deleted (${userCount} remaining)`)

    // ==========================================
    // DATABASE STATISTICS PRINT
    // ==========================================
    // console.log('\n Database cleared successfully!')
    // console.log(' Database Statistics:')
    // console.log(`   Total Users: ${userCount}`)
    // console.log('   Total Chat Sessions:')
    // console.log(`     - Browser Ext : ${sessionBrowserCount}`)
    // console.log(`     - Website     : ${sessionWebsiteCount}`)
    // console.log(`     - Office Ext  : ${sessionOfficeCount}`)
    // console.log('   Total Messages:')
    // console.log(`     - Browser Ext : ${msgBrowserCount}`)
    // console.log(`     - Website     : ${msgWebsiteCount}`)
    // console.log(`     - Office Ext  : ${msgOfficeCount}`)

  } catch (error) {
    console.error(' Error clearing database:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()