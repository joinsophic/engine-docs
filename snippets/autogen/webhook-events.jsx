// Generated from metadata/docs.json. Do not edit manually.

export const webhookEvents = [
  {
    "name": "account.activated",
    "resource_type": "account",
    "description": "A suspended account is reactivated."
  },
  {
    "name": "account.closed",
    "resource_type": "account",
    "description": "An account is permanently closed."
  },
  {
    "name": "account.closing",
    "resource_type": "account",
    "description": "An account begins closing and enters wind-down."
  },
  {
    "name": "account.opened",
    "resource_type": "account",
    "description": "A new account is opened."
  },
  {
    "name": "account.suspended",
    "resource_type": "account",
    "description": "An account is suspended."
  },
  {
    "name": "customer_authority.revoked",
    "resource_type": "customer_authority",
    "description": "A customer's authority is revoked."
  },
  {
    "name": "customer.closed",
    "resource_type": "customer",
    "description": "A customer profile is permanently closed."
  },
  {
    "name": "order.cancelled",
    "resource_type": "order",
    "description": "An order is cancelled."
  },
  {
    "name": "order.executing",
    "resource_type": "order",
    "description": "An order is submitted for execution."
  },
  {
    "name": "order.filled",
    "resource_type": "order",
    "description": "An order is fully executed and its trades are recorded."
  },
  {
    "name": "order.pending",
    "resource_type": "order",
    "description": "An order is waiting on a prerequisite before execution."
  },
  {
    "name": "order.placed",
    "resource_type": "order",
    "description": "A new order is accepted into the system."
  },
  {
    "name": "order.settled",
    "resource_type": "order",
    "description": "All trades on an order are settled."
  },
  {
    "name": "position.closed",
    "resource_type": "position",
    "description": "A position is fully closed."
  },
  {
    "name": "position.closing",
    "resource_type": "position",
    "description": "A position begins closing and can no longer be traded."
  },
  {
    "name": "position.opened",
    "resource_type": "position",
    "description": "A new position is opened."
  },
  {
    "name": "trade.executed",
    "resource_type": "trade",
    "description": "A trade is executed against an order."
  },
  {
    "name": "trade.settled",
    "resource_type": "trade",
    "description": "A trade is settled."
  }
];
