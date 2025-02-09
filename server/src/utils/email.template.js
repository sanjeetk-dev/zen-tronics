const emailTemplates = {
    /** Order Update Template */
    orderUpdate: ({ fullName, orderId, items, totalAmount, status }) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Update</title>
            <style>
                ${getEmailStyles()}
                .status.processing { background-color: #ffb6ff; }
                .status.shipped { background-color: #d97aff; }
                .status.delivered { background-color: #28A745; }
                .status.cancelled { background-color: #DC3545; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Order Update</h2>
                <p>Dear <strong>${fullName}</strong>,</p>
                <p>Your order status has been updated.</p>
                ${getOrderDetails(orderId, items, totalAmount)}
                <p>Your order status: <span class="status ${status.toLowerCase()}">${status}</span></p>
                <a href="https://yourwebsite.com/track/${orderId}" class="button">Track Your Order</a>
            </div>
        </body>
        </html>
    `,

    /** Order Placed Template */
    orderPlaced: ({ fullName, orderId, items, totalAmount }) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Confirmation</title>
            <style>${getEmailStyles()}</style>
        </head>
        <body>
            <div class="container">
                <h2>Order Confirmation</h2>
                <p>Dear <strong>${fullName}</strong>,</p>
                <p>Thank you for your order! We are processing it now.</p>
                ${getOrderDetails(orderId, items, totalAmount)}
                <a href="https://yourwebsite.com/order/${orderId}" class="button">View Your Order</a>
            </div>
        </body>
        </html>
    `,

    /** Shipping Delay Notification */
    shippingDelay: ({ fullName, orderId, estimatedDelivery }) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Shipping Delay</title>
            <style>${getEmailStyles()}</style>
        </head>
        <body>
            <div class="container">
                <h2>Shipping Delay Notification</h2>
                <p>Dear <strong>${fullName}</strong>,</p>
                <p>We regret to inform you that your order <strong>#${orderId}</strong> is experiencing a delay.</p>
                <p>We now expect it to arrive by <strong>${estimatedDelivery}</strong>. We sincerely apologize for the inconvenience.</p>
                <p>Thank you for your patience!</p>
                <a href="https://yourwebsite.com/track/${orderId}" class="button">Track Your Order</a>
            </div>
        </body>
        </html>
    `,

    /** Order Delivered Template */
    orderDelivered: ({ fullName, orderId }) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Delivered</title>
            <style>${getEmailStyles()}</style>
        </head>
        <body>
            <div class="container">
                <h2>Your Order Has Been Delivered!</h2>
                <p>Dear <strong>${fullName}</strong>,</p>
                <p>We are happy to inform you that your order <strong>#${orderId}</strong> has been successfully delivered.</p>
                <p>We hope you love your purchase! If you have any issues, feel free to contact us.</p>
                <a href="https://yourwebsite.com/orders/${orderId}" class="button">View Your Order</a>
            </div>
        </body>
        </html>
    `,

    /** Order Cancelled Template */
    orderCancelled: ({ fullName, orderId, refundStatus }) => `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Order Cancelled</title>
            <style>${getEmailStyles()}</style>
        </head>
        <body>
            <div class="container">
                <h2>Order Cancelled</h2>
                <p>Dear <strong>${fullName}</strong>,</p>
                <p>We regret to inform you that your order <strong>#${orderId}</strong> has been cancelled.</p>
                <p>${refundStatus ? `Your refund has been processed and should be credited soon.` : `If you were charged, we will process a refund shortly.`}</p>
                <p>We apologize for any inconvenience.</p>
                <a href="https://yourwebsite.com/support" class="button">Contact Support</a>
            </div>
        </body>
        </html>
    `,
};

/** Helper function to generate email styles */
const getEmailStyles = () => `
    body { font-family: Arial, sans-serif; background: #f5f0ff; padding: 20px; }
    .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); border-left: 5px solid #d97aff; }
    h2 { color: #d97aff; text-align: center; }
    p { color: #333333; }
    .order-details { background: #faf5ff; padding: 15px; border-radius: 6px; border-left: 4px solid #d97aff; }
    .button { display: block; width: max-content; background: #ff8e44; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px auto; text-align: center; }
`;

/** Helper function to generate order details section */
const getOrderDetails = (orderId, items, totalAmount) => `
    <div class="order-details">
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Items:</strong></p>
        <ul>${items.map(item => `<li>${item.name} (x${item.quantity}) - $${item.finalPrice}</li>`).join('')}</ul>
        <p><strong>Total Amount:</strong> $${totalAmount}</p>
    </div>
`;

export { emailTemplates };
