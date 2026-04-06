# Email Setup for Admin Replies

This document explains how to configure email functionality for the admin inbox/comms system.

## Current Setup

The admin messages system now supports:
- Replying to user messages directly from the admin panel
- Storing reply history in the database
- Optional email delivery to users
- Conversation threading

## Email Service Configuration

We use **Resend** for email delivery. To enable actual email sending:

### 1. Get a Resend API Key
1. Sign up at [resend.com](https://resend.com)
2. Create an API key from your dashboard
3. Add the API key to your environment variables

### 2. Environment Variables
Add this to your `.env.local` file:
```
RESEND_API_KEY=your_resend_api_key_here
```

### 3. Domain Configuration
- By default, emails are sent from `noreply@quick-hedgeconsulting.com`
- You'll need to verify your domain in Resend to send emails
- For development, you can use Resend's test domain

## Features

### Reply Form
- Click "Reply" on any message to open the reply form
- Type your response
- Choose whether to send via email (checked by default)
- Click "Send Reply" to save and optionally email the response

### Conversation History
- All replies are stored and displayed
- Admin replies are highlighted in purple
- User replies (if implemented) will appear in gray
- Email delivery status is shown for each reply

### Database Schema
The system uses two tables:
- `contact_messages` - Original messages from users
- `message_replies` - All replies to messages

## Testing

Without a Resend API key:
- Replies will be saved to the database
- Email sending will be simulated (logged to console)
- All other functionality works normally

With a Resend API key:
- Replies are saved AND sent via email
- Real email delivery to users

## Usage

1. Navigate to `/admin/messages` in your admin panel
2. View incoming messages from users
3. Click "Reply" on any message
4. Compose your response
5. Choose email delivery option
6. Send the reply

The conversation history will show all previous replies, making it easy to track ongoing communications.
