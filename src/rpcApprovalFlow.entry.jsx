import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { useForm } from 'react-hook-form'
import { ApprovalFlowEditor } from './components/ApprovalFlowEditor'
import axios from 'axios'

axios.defaults.baseURL = 'https://localhost:7080'

const rpcHistory = document.querySelector('#approvalFlow');

const queryClient = new QueryClient({})

approvalFlow && ReactDOM.createRoot(rpcHistory).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <ApprovalFlowEditor />
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)
