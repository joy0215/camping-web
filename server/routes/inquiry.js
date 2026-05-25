const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth'); 
const { Resend } = require('resend'); // Use Resend for reliable email notifications

const TOTAL_VANS = 3; // Maximum number of campervans available in inventory

// Initialize Resend instance (automatically picks up process.env.RESEND_API_KEY)
const resend = new Resend(process.env.RESEND_API_KEY);

// Helper function to format date objects into YYYY-MM-DD strings
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

// GET: Fetch all fully booked dates where van capacity is reached
router.get('/blocked-dates', async (req, res) => {
  try {
    // Retrieve all active orders that are not cancelled
    const result = await db.query("SELECT start_date, end_date FROM inquiries WHERE status != 'cancelled'");
    const dateCounts = {};
    
    // Count the number of rented vans for each specific date
    result.rows.forEach(order => {
      let current = new Date(order.start_date);
      const end = new Date(order.end_date);
      while (current <= end) {
        const dateStr = formatDate(current);
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        current.setDate(current.getDate() + 1);
      }
    });
    
    // Filter out dates where the number of rented vans meets or exceeds total inventory
    const blockedDates = Object.keys(dateCounts).filter(date => dateCounts[date] >= TOTAL_VANS);
    res.json(blockedDates);
  } catch (err) {
    console.error('Fetch blocked dates error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// POST: Create a new booking inquiry and trigger a notification email to the boss
router.post('/create', authMiddleware, async (req, res) => {
  // Destructure incoming data from frontend request body
  // contactInfo contains nested properties: { name, phone, email } sent by BookingPage.jsx
  const { startDate, endDate, estimatedPrice, addons, contactInfo } = req.body;
  const userId = req.user.id;

  // Safely extract customer details from contactInfo object with fallback defaults
  const contactName = contactInfo?.name || 'Not Provided';
  const contactPhone = contactInfo?.phone || 'Not Provided';
  const contactEmail = contactInfo?.email || 'Not Provided';

  try {
    // 1. Double-check availability on server-side to prevent race conditions or double-booking
    const allOrders = await db.query("SELECT start_date, end_date FROM inquiries WHERE status != 'cancelled'");
    const dateCounts = {};
    allOrders.rows.forEach(order => {
      let current = new Date(order.start_date);
      const end = new Date(order.end_date);
      while (current <= end) {
        const dateStr = formatDate(current);
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        current.setDate(current.getDate() + 1);
      }
    });

    let isOverlap = false;
    let checkCurrent = new Date(startDate);
    const checkEnd = new Date(endDate);
    while (checkCurrent <= checkEnd) {
      const dateStr = formatDate(checkCurrent);
      if (dateCounts[dateStr] && dateCounts[dateStr] >= TOTAL_VANS) {
        isOverlap = true;
        break;
      }
      checkCurrent.setDate(checkCurrent.getDate() + 1);
    }

    if (isOverlap) {
      return res.status(400).json({ error: 'Sorry, some dates in your selected range are fully booked. Please choose another date.' });
    }

    // 2. Insert the new pending inquiry record into NeonDB database
    const newInquiry = await db.query(
      `INSERT INTO inquiries (user_id, start_date, end_date, total_price, addons, contact_name, contact_phone, contact_email) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, startDate, endDate, estimatedPrice, JSON.stringify(addons), contactName, contactPhone, contactEmail]
    );

    const order = newInquiry.rows[0];

    // 3. Send out email notification asynchronously via Resend API
    const bossEmail = (process.env.BOSS_EMAIL || '').trim();

    if (bossEmail) {
      resend.emails.send({
        from: 'onboarding@resend.dev', // Default sender domain provided by Resend for testing
        to: bossEmail,
        subject: `🔔 [New Pending Order] Booking request from ${contactName}!`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px;">
            <h2 style="color: #ea580c; border-bottom: 2px solid #ea580c; padding-bottom: 10px;">🚗 New Booking Request (Pending)</h2>
            <p>The system has successfully recorded a new booking. The current status is <strong>Unpaid</strong>. Details below:</p>
            <ul style="line-height: 1.8; font-size: 15px;">
              <li><strong>Order ID:</strong> #${order.id}</li>
              <li><strong>Renter Name:</strong> ${contactName}</li>
              <li><strong>Phone:</strong> ${contactPhone}</li>
              <li><strong>Email:</strong> ${contactEmail}</li>
              <li><strong>Rental Period:</strong> ${new Date(startDate).toLocaleDateString()} ~ ${new Date(endDate).toLocaleDateString()}</li>
              <li><strong>Estimated Total:</strong> <span style="color: #ea580c; font-weight: bold;">NT$ ${Number(estimatedPrice).toLocaleString()}</span></li>
            </ul>
            <p style="color: #666; font-size: 12px; margin-top: 20px;">
              * System Note: If the customer successfully pays via NewebPay later, you will receive another "Payment Success" email. If it remains unpaid, you can contact the customer via the provided phone or email.
            </p>
          </div>
        `
      })
      .then(() => console.log(`📧 Notification sent to Boss via Resend for Order #${order.id}`))
      .catch(err => console.error(`❌ Failed to send email via Resend:`, err));
    } else {
      console.log(`⚠️ Email skip: BOSS_EMAIL is missing in Render environment variables.`);
    }

    // 4. Return success response with order data immediately back to the frontend client
    res.json({ success: true, inquiry: order });

  } catch (err) {
    console.error('Create inquiry error:', err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Retrieve all booking inquiries belongs to the logged-in member
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      'SELECT * FROM inquiries WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch my orders error:', err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// GET: Fetch details of a single inquiry by its specific ID (used by CheckoutPage)
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM inquiries WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Fetch single order error:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

module.exports = router;