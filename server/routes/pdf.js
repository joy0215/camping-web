const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// 設定 Gmail
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
    console.log(`📝 開始繪製標準穩定版授權書: ${guestName}`);

    // 設定文件 (標準 A4 邊距)
    const doc = new PDFDocument({ 
        size: 'A4', 
        margins: { top: 50, bottom: 50, left: 50, right: 50 } 
    });
    
    const buffers = [];
    doc.on('data', buffers.push.bind(buffers));

    // 載入中文字體
    const fontPath = path.join(__dirname, '../font.ttf');
    if (fs.existsSync(fontPath)) {
      doc.font(fontPath);
    } else {
      console.warn('⚠️ 警告：無中文字體，使用預設');
      doc.font('Helvetica');
    }

    // --- 🛠 工具函式：模擬粗體 ---
    const drawBoldText = (text, x, y, size = 12, color = 'black', align = 'left', width = null) => {
        doc.save(); 
        doc.fillColor(color).strokeColor(color).lineWidth(0.8); 
        const options = { stroke: true, fill: true, align: align };
        if (width) options.width = width;
        doc.fontSize(size).text(text, x, y, options);
        doc.restore(); 
    };

    // ==========================================
    // 📄 第一頁：交易資訊 (Transaction Info)
    // ==========================================

    // 1. 標題
    drawBoldText('信用卡授權書', 0, 50, 20, 'black', 'center', 595); 
    doc.fontSize(10).text('Credit Card Authorization Form', 0, 75, { align: 'center' });
    
    // 分隔線
    doc.moveTo(50, 95).lineTo(545, 95).lineWidth(1.5).stroke();

    // 2. 表格內容設定 (標準大小)
    let currentY = 120;
    const startX = 50;
    const valueX = 220; 
    const lineHeight = 30; // 適中的行距
    const sectionGap = 30; // 適中的區塊間距

    function drawField(label, value, isBox = false) {
        doc.fontSize(12).fillColor('black').text(label, startX, currentY);
        
        if (value) {
            doc.text(value, valueX, currentY);
        } else {
            doc.moveTo(valueX, currentY + 14).lineTo(500, currentY + 14).lineWidth(0.5).stroke();
        }
        
        if (isBox) {
             doc.rect(valueX, currentY - 2, 10, 10).stroke();
             doc.text(' VISA', valueX + 15, currentY);
             doc.rect(valueX + 60, currentY - 2, 10, 10).stroke();
             doc.text(' MASTER', valueX + 75, currentY);
             doc.rect(valueX + 130, currentY - 2, 10, 10).stroke();
             doc.text(' JCB', valueX + 145, currentY);
        }
        currentY += lineHeight;
    }

    // --- A. 信用卡資料 ---
    drawBoldText('【信用卡資料 / Credit Card Info】', startX, currentY, 13, '#d94e18');
    currentY += sectionGap;

    drawField('卡別 (Card Type):', null, true);
    drawField('持卡人姓名 (Cardholder):', guestName);
    drawField('信用卡卡號 (Card No.):', cardNumber);
    drawField('有效期限 (Expire Date):', '      月 (Month)  /        年 (Year)');
    drawField('背面末三碼 (CV2):', '');
    
    currentY += 10;
    
    // --- B. 持卡人資料 ---
    drawBoldText('【持卡人聯絡資料 / Contact Info】', startX, currentY, 13, '#d94e18');
    currentY += sectionGap;
    
    drawField('通訊地址 (Address):', '');
    drawField('抬頭/統編 (Tax ID):', '');
    drawField('聯絡電話 (Tel/Mobile):', '詳見訂單系統');
    drawField('Email:', '詳見訂單系統');

    currentY += 10;

    // --- C. 交易明細 ---
    drawBoldText('【交易內容 / Transaction Details】', startX, currentY, 13, '#d94e18');
    currentY += sectionGap;

    drawField('消費日期 (Date):', new Date().toLocaleDateString());
    drawField('消費項目 (Description):', '露營車租賃訂金 (Campervan Deposit)');
    drawField('使用人姓名 (Guest Name):', guestName);
    
    // 金額 (使用 16pt，清楚但不誇張)
    doc.fontSize(12).text('消費金額 (Amount):', startX, currentY);
    drawBoldText(`NT$ ${amount.toLocaleString()}`, valueX, currentY - 2, 16, '#d94e18'); 
    
    // --- D. 簽名欄 (放在第一頁下方) ---
    // 強制設定簽名欄位置在 Y=620，確保跟上面金額拉開距離
    // A4 高度約 840，620 處於頁面下方 3/4 處，非常安全
    const signY = 620; 
    const centerBoxX = 187.5; 

    drawBoldText('持卡人簽名 (Cardholder Signature)', 0, signY, 14, 'black', 'center', 595);
    
    // 簽名框
    doc.rect(centerBoxX, signY + 25, 220, 80).stroke();

    // 貼上簽名
    if (signature) {
        const base64Data = signature.replace(/^data:image\/\w+;base64,/, "");
        const imgBuffer = Buffer.from(base64Data, 'base64');
        doc.image(imgBuffer, centerBoxX + 10, signY + 35, { 
            width: 200, height: 60, fit: [200, 60], align: 'center'
        });
    }

    // 頁尾提示
    doc.fontSize(10).text('(接下頁條款 / Next Page)', 0, 780, { align: 'center', color: 'grey' });


    // ==========================================
    // 📄 第二頁：聲明與公司資訊 (Declaration)
    // ==========================================
    doc.addPage(); 

    // 1. 頁面標題
    drawBoldText('授權聲明與公司資訊', 0, 50, 16, 'black', 'center', 595);
    doc.fontSize(10).text('Authorization Declaration & Company Info', 0, 75, { align: 'center' });
    doc.moveTo(50, 95).lineTo(545, 95).lineWidth(1).stroke();

    let page2Y = 120;
    const contentX = 60;
    const contentWidth = 480;

    // 2. 委託聲明
    doc.fontSize(11).fillColor('black');
    doc.text('露途臺灣已委託嘉揚旅行社代為處理相關信用卡事務，包括刷卡、授權及退刷等作業。', contentX, page2Y);
    page2Y += 20;
    doc.text('Camper Road Taiwan has authorized JOYOUS TOUR SERVICE to handle all credit card–related matters.', contentX, page2Y);
    page2Y += 40;

    // 3. 法律條款 (恢復正常大小，排版整齊)
    const boxTop = page2Y;
    doc.rect(50, boxTop - 10, 500, 250).fill('#f9f9f9'); // 灰底
    doc.fill('black'); 

    const bulletPoints = [
        "＊ 以上資料，事關持卡人權益，請仔細核對信用卡資料勿流空白，並可避免瑕疵，造成理賠爭議。\nThe above information concerns the cardholder's rights. Please carefully verify the details.",
        "＊ 本持卡人聲明上列記述屬實，並授權 嘉揚旅行社 自本人之上述卡號信用卡扣取上述金額。\nThe cardholder declares that the above statements are true and authorizes JOYOUS TOUR SERVICE to charge the amount.",
        "＊ 若有錯誤及/或發卡銀行拒付上列款項，則概由本持卡人負責及付清。\nIn the event of bank refusal, the cardholder shall be responsible for full payment."
    ];

    bulletPoints.forEach(point => {
        doc.fontSize(11).text(point, contentX, page2Y, { width: contentWidth, align: 'left', lineGap: 4 });
        page2Y += 70; 
    });

    // 4. 公司資訊
    page2Y = 500; 
    
    doc.moveTo(50, page2Y).lineTo(545, page2Y).lineWidth(2).stroke(); 
    page2Y += 30;

    // 公司名稱
    drawBoldText('商店名稱 / Company Name:', contentX, page2Y, 12, '#333');
    page2Y += 20;
    drawBoldText('嘉揚旅行社股份有限公司', contentX, page2Y, 14, 'black');
    page2Y += 20;
    doc.fontSize(12).text('JOYOUS TOUR SERVICE CO; LTD', contentX, page2Y);
    
    page2Y += 40;

    // 統編
    drawBoldText('統一編號 / Business ID:', contentX, page2Y, 12, '#333');
    page2Y += 20;
    doc.fontSize(14).text('70366327', contentX, page2Y);

    page2Y += 40;

    // 地址
    drawBoldText('地址 / Address:', contentX, page2Y, 12, '#333');
    page2Y += 20;
    doc.fontSize(12).text('104台北市中山北路二段59巷9號3F之6', contentX, page2Y);

    doc.end();

    // --- 寄信邏輯 ---
    doc.on('end', async () => {
        try {
            const pdfData = Buffer.concat(buffers);
            const mailOptions = {
                from: '"CampingTour 系統" <system@campingtour.com>',
                to: process.env.BOSS_EMAIL,
                subject: `🔐 [授權書] ${guestName} - NT$${amount}`,
                html: `<h3>已收到信用卡授權書</h3><p>客戶：${guestName}</p><p>金額：$${amount}</p><p>附件為標準雙頁版 PDF。</p>`,
                attachments: [{ filename: `Auth_${guestName}.pdf`, content: pdfData }]
            };
            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: 'PDF generated' });
        } catch (err) {
            console.error('Email Error:', err);
            res.status(500).json({ error: 'Email Failed' });
        }
    });

  } catch (error) {
    console.error('PDF Error:', error);
    res.status(500).json({ error: 'PDF Failed' });
  }
});

module.exports = router;