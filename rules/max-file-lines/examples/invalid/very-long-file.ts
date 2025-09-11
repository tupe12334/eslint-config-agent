// Invalid: TypeScript file with way more than 100 lines (should trigger max-lines error)
interface User { id: number; name: string; email: string; }
interface Product { id: number; title: string; price: number; }
interface Order { id: number; userId: number; products: Product[]; }

const user1: User = { id: 1, name: 'John', email: 'john@example.com' };
const user2: User = { id: 2, name: 'Jane', email: 'jane@example.com' };
const user3: User = { id: 3, name: 'Bob', email: 'bob@example.com' };
const user4: User = { id: 4, name: 'Alice', email: 'alice@example.com' };
const user5: User = { id: 5, name: 'Charlie', email: 'charlie@example.com' };
const user6: User = { id: 6, name: 'Diana', email: 'diana@example.com' };
const user7: User = { id: 7, name: 'Eve', email: 'eve@example.com' };
const user8: User = { id: 8, name: 'Frank', email: 'frank@example.com' };
const user9: User = { id: 9, name: 'Grace', email: 'grace@example.com' };
const user10: User = { id: 10, name: 'Henry', email: 'henry@example.com' };

const product1: Product = { id: 1, title: 'Laptop', price: 999 };
const product2: Product = { id: 2, title: 'Mouse', price: 25 };
const product3: Product = { id: 3, title: 'Keyboard', price: 75 };
const product4: Product = { id: 4, title: 'Monitor', price: 300 };
const product5: Product = { id: 5, title: 'Headphones', price: 150 };
const product6: Product = { id: 6, title: 'Webcam', price: 80 };
const product7: Product = { id: 7, title: 'Speakers', price: 120 };
const product8: Product = { id: 8, title: 'Microphone', price: 200 };
const product9: Product = { id: 9, title: 'Tablet', price: 500 };
const product10: Product = { id: 10, title: 'Phone', price: 700 };
const product11: Product = { id: 11, title: 'Charger', price: 30 };
const product12: Product = { id: 12, title: 'Cable', price: 15 };
const product13: Product = { id: 13, title: 'Case', price: 40 };
const product14: Product = { id: 14, title: 'Stand', price: 60 };
const product15: Product = { id: 15, title: 'Bag', price: 90 };

const order1: Order = { id: 1, userId: 1, products: [product1, product2] };
const order2: Order = { id: 2, userId: 2, products: [product3] };
const order3: Order = { id: 3, userId: 3, products: [product4, product5, product6] };
const order4: Order = { id: 4, userId: 4, products: [product7, product8] };
const order5: Order = { id: 5, userId: 5, products: [product9] };
const order6: Order = { id: 6, userId: 6, products: [product10, product11] };
const order7: Order = { id: 7, userId: 7, products: [product12, product13, product14] };
const order8: Order = { id: 8, userId: 8, products: [product15] };
const order9: Order = { id: 9, userId: 9, products: [product1, product3, product5] };
const order10: Order = { id: 10, userId: 10, products: [product2, product4] };

export class OrderManagementService {
  private users = [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10];
  private products = [product1, product2, product3, product4, product5, product6, product7, product8, product9, product10, product11, product12, product13, product14, product15];
  private orders = [order1, order2, order3, order4, order5, order6, order7, order8, order9, order10];

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getProductById(id: number): Product | undefined {
    return this.products.find(product => product.id === id);
  }

  getOrderById(id: number): Order | undefined {
    return this.orders.find(order => order.id === id);
  }

  getUserOrders(userId: number): Order[] {
    return this.orders.filter(order => order.userId === userId);
  }

  calculateOrderTotal(order: Order): number {
    return order.products.reduce((total, product) => total + product.price, 0);
  }

  getExpensiveProducts(minPrice: number): Product[] {
    return this.products.filter(product => product.price >= minPrice);
  }

  getCheapProducts(maxPrice: number): Product[] {
    return this.products.filter(product => product.price <= maxPrice);
  }

  searchProductsByTitle(query: string): Product[] {
    return this.products.filter(product => product.title.toLowerCase().includes(query.toLowerCase()));
  }

  getUsersWithOrders(): User[] {
    const userIdsWithOrders = new Set(this.orders.map(order => order.userId));
    return this.users.filter(user => userIdsWithOrders.has(user.id));
  }

  getMostExpensiveOrder(): Order | undefined {
    let maxOrder: Order | undefined;
    let maxTotal = 0;
    
    for (const order of this.orders) {
      const total = this.calculateOrderTotal(order);
      if (total > maxTotal) {
        maxTotal = total;
        maxOrder = order;
      }
    }
    
    return maxOrder;
  }

  getOrdersByPriceRange(minPrice: number, maxPrice: number): Order[] {
    return this.orders.filter(order => {
      const total = this.calculateOrderTotal(order);
      return total >= minPrice && total <= maxPrice;
    });
  }

  getPopularProducts(): Product[] {
    const productCount = new Map<number, number>();
    
    for (const order of this.orders) {
      for (const product of order.products) {
        productCount.set(product.id, (productCount.get(product.id) || 0) + 1);
      }
    }
    
    return this.products.filter(product => (productCount.get(product.id) || 0) > 1).sort((a, b) => (productCount.get(b.id) || 0) - (productCount.get(a.id) || 0));
  }

  getAverageOrderValue(): number {
    const totalValue = this.orders.reduce((sum, order) => sum + this.calculateOrderTotal(order), 0);
    return totalValue / this.orders.length;
  }

  getUserSpending(userId: number): number {
    const userOrders = this.getUserOrders(userId);
    return userOrders.reduce((total, order) => total + this.calculateOrderTotal(order), 0);
  }

  getTopSpendingUsers(limit: number = 5): Array<{ user: User; totalSpent: number }> {
    const userSpending = this.users.map(user => ({
      user,
      totalSpent: this.getUserSpending(user.id)
    }));
    
    return userSpending.sort((a, b) => b.totalSpent - a.totalSpent).slice(0, limit);
  }
}

const data1 = 'extra'; const data2 = 'data'; const data3 = 'to'; const data4 = 'make'; const data5 = 'file';
const data6 = 'longer'; const data7 = 'than'; const data8 = '100'; const data9 = 'lines'; const data10 = 'for';
const data11 = 'testing'; const data12 = 'max'; const data13 = 'lines'; const data14 = 'rule'; const data15 = 'error';

// This file has way more than 100 lines and should trigger a max-lines error