import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { useForm } from 'react-hook-form'
import { RPCHistory } from './components/RPCHistory'
import axios from 'axios'

axios.defaults.baseURL = ''

const rpcHistory = document.getElementById('rpcHistory');

const queryClient = new QueryClient({})

rpcHistory && ReactDOM.createRoot(rpcHistory).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <RPCHistory employeeId={rpcHistory.dataset.employeeId} />
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
)

const rpcHistoryMulti = document.querySelectorAll('.multiRPCStatus')

rpcHistoryMulti && rpcHistoryMulti.forEach(item => {
	ReactDOM.createRoot(item).render(
		<React.StrictMode>
			<QueryClientProvider client={queryClient} contextSharing={true}>
				<RPCHistory employeeId={item.dataset.employeeId} mini={true}/>
			</QueryClientProvider>
		</React.StrictMode>
	)
})