const express = require('express')
const nodemailer = require('nodemailer')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())

// Create transporter
const transporter = nodemailer.createTransport({
  pool: true,
  host: 'smtpout.secureserver.net',
  port: 465,
  secure: true,
  // Pool-specific configurations
  maxConnections: 5, // Maximum number of connections to make
  maxMessages: 100, // Maximum number of messages per connection
  rateDelta: 1000, // How many milliseconds between checks
  rateLimit: 5, // Maximum number of messages to send in rateDelta time
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Serve static files from the 'public' directory
app.use(express.static('public'))

// Handle CORS
app.use(cors())

// Email sending endpoint
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, text } = req.body

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center;">
          <h1 style="color: #333;">Xperts Software House</h1>
        </div>
        
        <div style="padding: 20px; background-color: white;">
          ${text}
        </div>
        
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; margin-top: 20px;">
          <p style="margin: 0; color: #666;">
            Contact us: contact@xpertssoftwarehouse.com<br>
            © ${new Date().getFullYear()} Xperts Software House. All rights reserved.
          </p>
        </div>
      </div>
    `

    const mailOptions = {
      from: '"Xperts Software House" <contact@xpertssoftwarehouse.com>',
      to,
      subject,
      text, // Fallback plain text
      html: htmlContent, // HTML version
    }

    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
