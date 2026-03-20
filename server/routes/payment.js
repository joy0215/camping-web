const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/db');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const HASH_KEY = process.env.NEWEBPAY_HASH_KEY;
const HASH_IV = process.env.NEWEBPAY_HASH_IV;
const MERCHANT_ID = process.env.NEWEBPAY_MERCHANT_ID;
const RETURN_URL = process.env.NEWEBPAY_RETURN_URL;
const NOTIFY_URL = process.env.NEWEBPAY_NOTIFY_URL;

// 1. AES 加密
function create_mpg_aes_encrypt(TradeInfo) {
    const cipher = crypto.createCipheriv('aes-256-cbc', HASH_KEY, HASH_IV);
    let encrypted = cipher.update(TradeInfo, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

// 2. SHA 加密
function create_mpg_sha_encrypt(aesEncrypt) {
    const sha = crypto.createHash('sha256');
    const plainText = `HashKey=${HASH_KEY}&${aesEncrypt}&HashIV=${HASH_IV}`;
    return sha.update(plainText).digest('hex').toUpperCase();
}

// 🆕 3. AES 解密函數 (用來解密藍新傳回來的結果)
function decryptTradeInfo(TradeInfoHex) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', HASH_KEY, HASH_IV);
    decipher.setAutoPadding(false);
    let text = decipher.update(TradeInfoHex, 'hex', 'utf8');
    text += decipher.final('utf8');
    // 移除藍新金流特有的填充字元
    const cleanText = text.replace(/[\x00-\x1F\x7F-\x9F]/g, ""); 
    return JSON.parse(cleanText);
}

// 產生付款參數 API
router.post('/create-payment', async (req, res) => {
    try {
        const { orderId, amount, email } = req.body;
        const timeStamp = Math.round(new Date().getTime() / 1000);
        const merchantOrderNo = `CT${orderId}T${timeStamp}`; 

        const tradeInfoParams = new URLSearchParams({
            MerchantID: MERCHANT_ID,
            RespondType: 'JSON',
            TimeStamp: timeStamp,
            Version: '2.0',
            MerchantOrderNo: merchantOrderNo,
            Amt: amount,
            ItemDesc: 'CampingTour 露營車預約訂金', 
            Email: email || '',
            ReturnURL: RETURN_URL,
            NotifyURL: NOTIFY_URL,
            ClientBackURL: 'https://camping-web-silk.vercel.app/',
        });

        const TradeInfo = create_mpg_aes_encrypt(tradeInfoParams.toString());
        const TradeSha = create_mpg_sha_encrypt(TradeInfo);

        await db.query('UPDATE inquiries SET merchant_order_no = $1 WHERE id = $2', [merchantOrderNo, orderId]);

        res.json({
            success: true,
            payData: { MerchantID: MERCHANT_ID, TradeInfo, TradeSha, Version: '2.0' }
        });

    } catch (error) {
        res.status(500).json({ success: false, message: '系統產生付款參數失敗' });
    }
});

// 🆕 共用的「處理付款成功」邏輯
async function handlePaymentSuccess(tradeInfoHex) {
    try {
        const result = decryptTradeInfo(tradeInfoHex);
        
        if (result.Status === 'SUCCESS') {
            const merchantOrderNo = result.Result.MerchantOrderNo;
            
            // 1. 更新資料庫狀態為已付款 (confirmed)
            const updateRes = await db.query(
                "UPDATE inquiries SET status = 'confirmed' WHERE merchant_order_no = $1 RETURNING *", 
                [merchantOrderNo]
            );

            const order = updateRes.rows[0];

            if (order) {
                // 2. 寄出成功通知信 (因為我們已經有 contact_name，直接使用)
                const startDate = new Date(order.start_date).toLocaleDateString();
                const endDate = new Date(order.end_date).toLocaleDateString();

                resend.emails.send({
                    from: 'onboarding@resend.dev',
                    to: process.env.BOSS_EMAIL,
                    subject: `💰 [付款成功] 訂單 #${order.id} 已確認！`,
                    html: `
                        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                        <h2 style="color: #10b981;">🎉 露營車訂單已付款成功！</h2>
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                        <p><strong>承租人：</strong> ${order.contact_name}</p>
                        <p><strong>聯絡電話：</strong> ${order.contact_phone}</p>
                        <p><strong>取車日期：</strong> ${startDate}</p>
                        <p><strong>還車日期：</strong> ${endDate}</p>
                        <p><strong>已付金額：</strong> <span style="color: #ea580c; font-size: 1.2em; font-weight: bold;">NT$ ${Number(order.total_price).toLocaleString()}</span></p>
                        <p><strong>藍新交易序號：</strong> ${merchantOrderNo}</p>
                        </div>
                    `
                }).catch(err => console.error('寄信失敗', err));
                
                console.log(`✅ 訂單 ${merchantOrderNo} 付款成功，已更新資料庫並寄信！`);
            }
        }
    } catch (error) {
        console.error('解密或更新資料庫失敗:', error);
    }
}

// 🆕 前端跳轉回來的 ReturnURL (POST)
router.post('/return', async (req, res) => {
    console.log('🔗 藍新 ReturnURL 觸發！');
    if (req.body.TradeInfo) {
        // 執行解密與資料庫更新
        await handlePaymentSuccess(req.body.TradeInfo);
    }
    // 更新完畢後，把客人導向會員中心，客人就能立刻看到「已確認」的狀態！
    res.redirect('https://camping-web-silk.vercel.app/dashboard');
});

// 🆕 藍新背景通知的 NotifyURL (POST)
router.post('/notify', async (req, res) => {
    console.log('🔗 藍新 NotifyURL 觸發！');
    if (req.body.TradeInfo) {
        await handlePaymentSuccess(req.body.TradeInfo);
    }
    // 藍新規定背景通知必須回傳 200 或字串
    res.status(200).send('OK');
});

module.exports = router;