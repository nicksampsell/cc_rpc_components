import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { useForm } from 'react-hook-form'
import { RPCHistory } from './components/RPCHistory'
import axios from 'axios'

axios.defaults.baseURL = 'https://localhost:7080'

const actionEditor = document.getElementById('rpcHistory');
const dataMap = {
  employeeId: actionEditor.dataset.employeeId
}

const queryClient = new QueryClient({})

ReactDOM.createRoot(actionEditor).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <RPCHistory {...dataMap} />
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)