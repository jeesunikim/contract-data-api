### [Prisma] TypedSQL

https://www.prisma.io/docs/orm/prisma-client/using-raw-sql/typedsql

### I followed the following instructions from Claude

Step 1: Understand Your Current Architecture Pattern

You already have a working example with transactions:

- Route: src/routes/transactions.js:6 - defines router.get("/:transaction_hash", getTransactionByHash)
- Controller: src/controllers/transaction.js:5 - handles the business logic
- Pattern: Route → Controller → Prisma query

Step 2: Learn from Express.js Route Parameters

Study this resource: https://expressjs.com/en/guide/routing.html#route-parameters

Your transaction example shows:
// Route definition
router.get("/:transaction_hash", getTransactionByHash);
// Parameter extraction
const { transaction_hash } = req.params;

For your keys route, you'll need: router.get("/:contract_id/keys", getKeysByContractId)

Step 3: Understand Database Schema Requirements

From your src/index.js:32, I see you're querying contract_data table. You'll need to:

1. Add a Prisma model for contract_data in your schema

// I did Number One by running: npx prisma db pull

2. Query key_decoded column as mentioned in your comments

Learn about Prisma models: https://www.prisma.io/docs/concepts/components/prisma-schema/data-model

Step 4: Study Your Existing Controller Pattern

Your transaction.js controller shows the pattern:

- Parameter validation
- Prisma query with findFirst
- Error handling (400, 404, 500)
- JSON response

Resource: https://expressjs.com/en/guide/error-handling.html

Step 5: Practice Exercise

Try creating:

1. src/routes/contracts.js - following your transactions.js pattern
2. src/controllers/contract.js - following your transaction.js pattern
3. Add the contract_data model to your Prisma schema

Study your exact pattern: Look at how src/index.js:22 would uncomment and use your transaction routes, then apply the same pattern for contracts.

Would you like to start with any specific step, or do you want me to elaborate on any of these learning resources?
