import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import TransactionHistory from "./pages/TransactionHistory";
import BlockchainLedger from "./pages/BlockchainLedger";
import AIReports from "./pages/AIReports";
import NotFound from "./pages/NotFound";
import CreateDivision from "./pages/CreateDivision";
import CreateProject from "./pages/CreateProject";
import TaskList from "./pages/ListTransactions";
import CreateTransaction from "./pages/CreateTransaction";
import TransactionDetail from "./pages/TransactionDetail";
import TransactionDetailAdmin from "./pages/TransactionDetailAdmin";
import AddMember from "./pages/AddMember";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/transaction-history" element={<TransactionHistory />} />
          <Route path="/blockchain-ledger" element={<BlockchainLedger />} />
          <Route path="/ai-reports" element={<AIReports />} />
          <Route path="/divisi" element={<CreateDivision />} />
          <Route path="/divisions/:divisionId/projects" element={<CreateProject />} />
          <Route
            path="/divisions/:divisionId/projects/:projectId/tasks"
            element={<TaskList />}
          />
          <Route path="/transactions/:id" element={<TransactionDetail />} />
          <Route
            path="/divisions/:divisionId/projects/:projectId/transactions/:transactionId"
            element={<TransactionDetailAdmin />}
          />
          <Route path="/add-member" element={<AddMember />} />

          <Route path="/divisions/:divisionId/projects/:projectId/transactions/create" element={<CreateTransaction />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
