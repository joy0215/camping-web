const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

router.post('/generate', async (req, res) => {
  const { guestName, cardNumber, amount, signature } = req.body;

  try {
    console.log(`📝 開始生成 PDF: ${guestName}`); // Debug Log

    const doc = new PDFDocument();
    let buffers = [];
    
    doc.on('data', buffers.push.bind(buffers));
    
    // ⚠️ 關鍵修正：這裡的 async callback 必須要有自己的 try-catch
    doc.on('end', async () => {
      try {
        console.log('📦 PDF 生成完畢，準備寄信...');
        const pdfData = Buffer.concat(buffers);

        await transporter.sendMail({
          from: '"CampingTour Auth" <system@campingtour.com>',
          to: process.env.BOSS_EMAIL,
          subject: `🔐 [授權書] ${guestName}`,
          html: `<h3>收到授權書</h3><p>金額：$${amount}</p>`,
          attachments: [{ filename: 'Auth_Form.pdf', content: pdfData }]
        });

        console.log('✅ Email 寄送成功！');
        res.json({ success: true, message: 'PDF generated and sent' });

      } catch (innerErr) {
        // 捕捉寄信時發生的錯誤
        console.error('❌ 寄信失敗 (Email Error):', innerErr);
        // 如果還沒回傳過 response，才回傳錯誤
        if (!res.headersSent) {
          res.status(500).json({ error: 'Email sending failed', details: innerErr.message });
        }
      }
    });

    // --- PDF 繪製區 ---
    doc.fontSize(20).text('CREDIT CARD AUTHORIZATION', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Guest: ${guestName}`);
    doc.text(`Card: ${cardNumber}`);
    doc.text(`Amount: $${amount}`);
    doc.moveDown(2);

    // 圖片處理 (加強保護)
    if (signature && signature.startsWith('data:image')) {
      try {
        const base64Data = signature.split(',')[1];
        const imgBuffer = Buffer.from(base64Data, 'base64');
        doc.text('Signature:');
        doc.image(imgBuffer, { width: 150 });
      } catch (imgErr) {
        console.error('⚠️ 簽名圖片處理失敗:', imgErr.message);
        doc.text('(Signature Image Error)');
      }
    } else {
      doc.text('(No Signature Provided)');
    }

    doc.end(); // 這會觸發上面的 'end' 事件

  } catch (err) {
    console.error('❌ PDF 生成失敗 (PDFKit Error):', err);
    res.status(500).json({ error: 'PDF Generation Error', details: err.message });
  }
});

module.exports = router;