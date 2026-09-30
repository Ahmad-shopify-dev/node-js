import EventEmitter from "node:events";

// Step 1: Custom OrderEmitter Class create karna
class OrderSystem extends EventEmitter {
  placeOrder(orderData) {
    console.log(`\n📦 [DB] Order #${orderData.id} saved to database.`);

    // Order save hone ke baad event emit (publish) kar diya
    // Hum listener ko data pass kar rahe hain: orderData
    this.emit('orderPlaced', orderData);
  }
}

const orderApp = new OrderSystem();

// ==========================================
// Step 2: Event Listeners Register karna
// ==========================================

// Listener 1: Email Notification Service
orderApp.on('orderPlaced', (order) => {
  // Real app mein yahan Nodemailer / SendGrid ka code hota hai
  console.log(`✉️  [Email Service] Confirmation email sent to ${order.customerEmail}`);
});

// Listener 2: Inventory / Stock Service
orderApp.on('orderPlaced', (order) => {
  console.log(`🏭 [Inventory] Stock updated for Item ID: ${order.itemId}`);
});

// Listener 3: Analytics Service
orderApp.on('orderPlaced', (order) => {
  console.log(`📊 [Analytics] Sales logged: $${order.amount}`);
});

// Listener 4: Sirf PEHLI DAFA chalne wala listener (.once)
orderApp.once('orderPlaced', (order) => {
  console.log(`🎉 [Promo] First order milestone tracked for customer!`);
});


// ==========================================
// Step 3: Trigger / Execution (Real Request)
// ==========================================

console.log('--- Order 1 Process ---');
orderApp.placeOrder({
  id: 1001,
  customerEmail: 'ali@example.com',
  itemId: 'LAPTOP-PRO',
  amount: 1200
});

console.log('\n--- Order 2 Process ---');
orderApp.placeOrder({
  id: 1002,
  customerEmail: 'sara@example.com',
  itemId: 'MOUSE-RGB',
  amount: 50
});


