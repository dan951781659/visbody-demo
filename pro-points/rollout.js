// Shared by the two demos on the same origin. This ledger contains mock entries only.
const pointsRollout = {
  key: 'wellnesshub-pro-rollout-demo-v1',
  initial: { id: 'rollout-1', points: 250, reason: '月付 500 分 × 剩余 15 / 30 天', source: '上线初始化' },
  entries() {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  },
  add(entry) {
    const entries = this.entries();
    if (entries.some(row => row.id === entry.id)) return false;
    localStorage.setItem(this.key, JSON.stringify([...entries, entry]));
    return true;
  },
  customerEntries() {
    return this.entries().filter(entry => !entry.customerId || entry.customerId === '10086');
  },
  balance() {
    return this.customerEntries().reduce((sum, entry) => sum + entry.points, 0);
  }
};
