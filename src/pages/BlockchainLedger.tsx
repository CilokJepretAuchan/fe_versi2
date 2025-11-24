import Sidebar from "@/components/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Hash, Clock, Shield } from "lucide-react";

const BlockchainLedger = () => {
  const blocks = [
    {
      number: 1,
      hash: "0x4f3d2a1b9c8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1",
      previousHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      timestamp: "2025-01-15 10:30:00",
      transactions: 5,
    },
    {
      number: 2,
      hash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      previousHash: "0x4f3d2a1b9c8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1",
      timestamp: "2025-01-16 14:20:00",
      transactions: 8,
    },
    {
      number: 3,
      hash: "0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
      previousHash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
      timestamp: "2025-01-17 09:15:00",
      transactions: 12,
    },
    {
      number: 4,
      hash: "0x9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e",
      previousHash: "0x2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d",
      timestamp: "2025-01-18 16:45:00",
      transactions: 6,
    },
    {
      number: 5,
      hash: "0x5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a",
      previousHash: "0x9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e",
      timestamp: "2025-01-19 11:30:00",
      transactions: 10,
    },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Blockchain Ledger</h1>
          <p className="text-muted-foreground">
            Immutable record dari semua transaksi
          </p>
        </div>

        <div className="space-y-4">
          {blocks.map((block) => (
            <div
              key={block.number}
              className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border hover:shadow-glow transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      Block #{block.number}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {block.transactions} transactions
                    </p>
                  </div>
                </div>
                <Badge className="rounded-lg">Verified</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Hash className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Block Hash:
                    </p>
                    <p className="text-sm text-foreground font-mono break-all">
                      {block.hash}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Hash className="w-5 h-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Previous Hash:
                    </p>
                    <p className="text-sm text-foreground font-mono break-all">
                      {block.previousHash}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <p className="text-sm text-foreground">
                    <span className="text-muted-foreground">Timestamp:</span>{" "}
                    {block.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BlockchainLedger;
