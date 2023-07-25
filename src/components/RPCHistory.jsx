import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import axios from 'axios'
import { useFormContext} from 'react-hook-form'
import { ApprovalTimeline } from './ApprovalTimeline'
import { MdExpandMore, MdExpandLess } from 'react-icons/md'
import { useState, useEffect } from 'react'

export const useGetRPCStatuses = (employeeId) =>
useQuery({
	queryKey: ['getRPCStatuses', employeeId],
	queryFn: async () => {
		const { data } = await axios.get('/Api/RPCApi/getEmployeeRPCStatuses/' + employeeId,
		{
			withCredentials: true,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		})
		return data
	},
	enabled: !!employeeId
})

export function RPCHistory({employeeId, mini}) 
{

	const { status, data: rpcStatuses, error, isFetching, isLoading } = useGetRPCStatuses(employeeId)
    const [ rowStatus, setRowStatus ] = useState([]);

    useEffect(() => {
        if(typeof(rpcStatuses) != "undefined")
        {
            let localRowStatus = []
            rpcStatuses.Items.map(item => localRowStatus.push(
                ({
                    rowId: item.id,
                    expanded: false
                }))
            )

            setRowStatus(localRowStatus)
        }
    }, [rpcStatuses])

    const toggleRow = (rowId) => {

        let currentElement = rowStatus.find(x => x.rowId == rowId)

        setRowStatus([
                ...rowStatus.filter(x => x.rowId != rowId),
                {
                    rowId: currentElement.rowId,
                    expanded: !currentElement.expanded
                }
            ])

    }

	return (
		<div className="shadow-sm">
			<table className="w-full border text-left table-fixed">
                <thead>
                    <tr className="text-medium bg-gray-300">
                        <th className="p-3 w-[20%]">RPC</th>
                        <th className="w-[60%]">Status</th>
                        <th className="w-[15%]">Latest Activity</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                	{ rpcStatuses && 
                        rpcStatuses.Items.length > 0 ? 
                            rpcStatuses.Items.map(item => (
                        		<tr 
                                    className="odd:bg-white even:bg-slate-100" 
                                    key={item.id}
                                    >
                        			<td className="p-3 text-gray-800 text-sm">
                                    <a href={'/rpc/'+item.id} className="hover:text-blue-900">
                                        <strong className="text-semibold">{item.categoryTitle}</strong>:<br />{item.title}
                                    </a>
                                    </td>
                        			<td className="w-[60%]">
                                        <ApprovalTimeline 
                                            approvalFlow={rpcStatuses.ApprovalFlow} 
                                            rpcStatus={item.approvals} 
                                            rpcInfo={item}
                                            mini={mini}
                                            isExpanded={rowStatus?.find(x => x.rowId == item.id)?.expanded} />
                                    </td>
                        			<td className="text-gray-800 text-sm">Status: <strong className="text-semibold">{item.status}</strong><br />
                        			<small className="text-xs text-gray-700">{item.updated}</small></td>
                                    {!mini ? (<td className="text-end p-2">
                                        {(rowStatus?.length > 0) && (
                                            <button type="button" onClick={() => toggleRow(item.id)} className="text-3xl">
                                                { rowStatus.find(x => x.rowId == item.id).expanded == true ? (<MdExpandLess />) : (<MdExpandMore />) }
                                            </button>                                    
                                        )}
                                    </td>
                                    ) : (<td></td>) }
                        		</tr>
                            ))
                         : (<tr><td colSpan="4" className="p-3">There are no RPCs associated with this employee.</td></tr>) }
                </tbody>
            </table>
		</div>
	)
}