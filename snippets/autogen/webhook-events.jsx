// Generated from metadata/docs.json. Do not edit manually.

export const webhookEvents = [
  {
    "description": "A suspended account is reactivated.",
    "name": "account.activated",
    "resource_type": "account"
  },
  {
    "description": "An account is permanently closed.",
    "name": "account.closed",
    "resource_type": "account"
  },
  {
    "description": "An account begins closing and enters wind-down.",
    "name": "account.closing",
    "resource_type": "account"
  },
  {
    "description": "A new account is opened.",
    "name": "account.opened",
    "resource_type": "account"
  },
  {
    "description": "An account is suspended.",
    "name": "account.suspended",
    "resource_type": "account"
  },
  {
    "description": "A customer profile is permanently closed.",
    "name": "customer.closed",
    "resource_type": "customer"
  },
  {
    "description": "A customer's authority is revoked.",
    "name": "customer_authority.revoked",
    "resource_type": "customer_authority"
  },
  {
    "description": "An order is cancelled.",
    "name": "order.cancelled",
    "resource_type": "order"
  },
  {
    "description": "An order is submitted for execution.",
    "name": "order.executing",
    "resource_type": "order"
  },
  {
    "description": "An order is fully executed and its trades are recorded.",
    "name": "order.filled",
    "resource_type": "order"
  },
  {
    "description": "An order is waiting on a prerequisite before execution.",
    "name": "order.pending",
    "resource_type": "order"
  },
  {
    "description": "A new order is accepted into the system.",
    "name": "order.placed",
    "resource_type": "order"
  },
  {
    "description": "All trades on an order are settled.",
    "name": "order.settled",
    "resource_type": "order"
  },
  {
    "description": "A position is fully closed.",
    "name": "position.closed",
    "resource_type": "position"
  },
  {
    "description": "A position begins closing and can no longer be traded.",
    "name": "position.closing",
    "resource_type": "position"
  },
  {
    "description": "A new position is opened.",
    "name": "position.opened",
    "resource_type": "position"
  },
  {
    "description": "A trade is executed against an order.",
    "name": "trade.executed",
    "resource_type": "trade"
  },
  {
    "description": "A trade is settled.",
    "name": "trade.settled",
    "resource_type": "trade"
  }
];
