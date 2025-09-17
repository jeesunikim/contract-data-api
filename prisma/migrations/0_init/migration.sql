-- CreateTable
CREATE TABLE "contract_data" (
    "id" TEXT,
    "ledger_sequence" INTEGER NOT NULL,
    "key_hash" TEXT,
    "durability" TEXT,
    "key_decoded" TEXT,
    "key" BYTEA,
    "val" BYTEA,
    "closed_at" TIMESTAMPTZ(6) NOT NULL,
    "pk_id" BIGSERIAL NOT NULL,

    CONSTRAINT "contract_data_pkey" PRIMARY KEY ("pk_id")
);

-- CreateTable
CREATE TABLE "gorp_migrations" (
    "id" TEXT NOT NULL,
    "applied_at" TIMESTAMPTZ(6),

    CONSTRAINT "gorp_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ttl" (
    "key_hash" TEXT,
    "ledger_sequence" INTEGER NOT NULL,
    "live_until_ledger_sequence" INTEGER NOT NULL,
    "closed_at" TIMESTAMPTZ(6) NOT NULL,
    "pk_id" BIGSERIAL NOT NULL,

    CONSTRAINT "ttl_pkey" PRIMARY KEY ("pk_id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" TEXT,
    "ledger_sequence" INTEGER NOT NULL,
    "transaction_hash" TEXT NOT NULL,
    "closed_at" TIMESTAMPTZ(6) NOT NULL,
    "tx_envelope" TEXT NOT NULL,
    "tx_result" TEXT NOT NULL,
    "tx_meta" TEXT NOT NULL,
    "tx_fee_meta" TEXT NOT NULL,
    "successful" BOOLEAN NOT NULL,
    "diagnostic_events" TEXT NOT NULL,
    "transaction_events" TEXT NOT NULL,
    "contract_events" TEXT NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("transaction_hash")
);

-- CreateIndex
CREATE INDEX "idx_contract_id" ON "contract_data"("id");

-- CreateIndex
CREATE INDEX "idx_key_decoded" ON "contract_data"("key_decoded");

-- CreateIndex
CREATE INDEX "idx_key_hash" ON "contract_data"("key_hash");

-- CreateIndex
CREATE INDEX "idx_transaction_hash" ON "transaction"("transaction_hash");

