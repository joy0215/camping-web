const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authMiddleware = require('../middleware/auth'); 
const nodemailer = require('nodemailer'); // Import nodemailer for email notifications

const TOTAL_VANS = 3; // Maximum number of campervans available

// Helper function to format dates as YYYY-MM-DD for database and comparison
const formatDate = (date) => {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  return [year, month, day].join('-');
};

// Setup Gmail SMTP transporter for sending notifications
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Fetch fully booked dates (where all vans are rented)
router.get('/blocked-dates', async (req, res) => {
  try {
    // Exclude cancelled orders
    const result = await db.query("SELECT start_date, end_date FROM inquiries WHERE status != 'cancelled'");
    const dateCounts = {};
    
    // Calculate the number of booked vans for each day
    result.rows.forEach(order => {
      let current = new Date(order.start_date);
      const end = new Date(order.end_date);
      while (current <= end) {
        const dateStr = formatDate(current);
        dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        current.setDate(current.getDate() + 1);
      }
    });
    
    // Filter dates that have reached the maximum van capacity
    const blockedDates = Object.keys(dateCounts).filter(date => dateCounts[date] >= TOTAL_VANS);
    res.json(blockedDates);
  } catch (err) {
    console.error('Fetch blocked dates error:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});

// Create a new booking inquiry
router.post('/create', authMiddleware, async (req, res) => {
  const { startDate, endDate, estimatedPrice, addons, contactName, contactPhone, contactEmail } = req.body;
  const userId = req.user.id;

  try {
    // 1. Verify availability again to prevent double-booking during checkout
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

    // Return error if dates are no longer available
    if (isOverlap) {
      return res.status(400).json({ error: 'Sorry, some dates in your selected range are fully booked. Please choose another date.' });
    }

    // 2. Insert the new order into the database
    const newInquiry = await db.query(
      `INSERT INTO inquiries (user_id, start_date, end_date, total_price, addons, contact_name, contact_phone, contact_email) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, startDate, endDate, estimatedPrice, JSON.stringify(addons), contactName, contactPhone, contactEmail]
    );

    const order = newInquiry.rows[0];

    // 3. Prepare the email notification for the boss (Pending Order)
    const mailOptions = {
      from: `"CampingTour System" <${process.env.GMAIL_USER}>`,
      to: process.env.BOSS_EMAIL, // Boss's email address
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
    };

    // 4. Send email asynchronously (do NOT use await)
    // This ensures the frontend gets a fast response without waiting for Gmail's server.
    transporter.sendMail(mailOptions)
      .then(info => console.log(`📧 Notification sent to Boss for pending Order #${order.id}`))
      .catch(err => console.error(`❌ Failed to send email via Gmail:`, err));

    // 5. Return success response to frontend immediately
    res.json({ success: true, inquiry: order });

  } catch (err) {
    console.error('Create inquiry error:', err.message);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch all orders for the currently logged-in user
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

// Fetch a single order by ID (Used when navigating directly to the checkout page via URL)
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