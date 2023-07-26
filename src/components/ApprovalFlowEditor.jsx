import React, {useState, forwardRef, useEffect} from 'react'
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query'
import axios from 'axios'
import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {SortableItem} from './SortableItem'
import {RxDragHandleDots1} from 'react-icons/rx'
import {MdOutlineDragHandle, MdLock, MdOutlineDeleteForever, MdOutlineHelp} from 'react-icons/md'
import {ApprovalFlowSearch} from './ApprovalFlowSearch'
import { MouseSensor, KeyboardSensor } from './ApprovalFlowOverrideSensor'

export const useGetApprovalFlow = () =>
useQuery({
	queryKey: ['getApprovalFlow'],
	queryFn: async () => {
		const { data } = await axios.get('/Api/ApprovalFlowApi/GetApprovalFlow',
		{
			withCredentials: true,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		})
		return data
	}
})

export const useEditApprovalFlowMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data) => {
			return axios({
				url:'/Api/ApprovalFlowApi/UpdateApprovalFlow',
				method: 'put',
				data: data,
				withCredentials: true,
				headers: {
					'X-Requested-With': 'XMLHttpRequest'
				}
			})
		},
		onSuccess: (result, data, context) => {
			queryClient.invalidateQueries({ queryKey: ['getApprovalFlow'] })
		}
	})
}



export function ApprovalFlowEditor()
{
	const getIndex = (id) => items.indexOf(id)

	const [activeId, setActiveId] = useState(null)
	const [items, setItems] = useState([])
	const [showHelp, setShowHelp] = useState(true)
	const activeIndex = activeId ? getIndex(activeId) : -1;
	const { status, data: approvalFlowItems, error, isFetching, isLoading } = useGetApprovalFlow()
	const createApprovalFlowMutation = useEditApprovalFlowMutation();
	
	const sensors = useSensors(
		useSensor(MouseSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	)

	useEffect(() => {
		if(typeof(approvalFlowItems) !== "undefined")
		{
			setItems(approvalFlowItems)
		}
	}, [approvalFlowItems])


	const addToList = (item) => {
		setItems([...items,item])
	}

	const removeFromList = (item) => {
		const filteredItems = items.filter(x => x.id != item)
		setItems([...filteredItems])
	}

	const saveQueue = () => {
		const dataLoad = items.filter(x => x.id != 41 && x.id != 42).map((x, index) => ({
			id: typeof(x.id) == 'number' ? x.id : -1,
			ordinal: index,
			title: x.title,
			userId: x.userId
		}));

		
		createApprovalFlowMutation.mutate(dataLoad)
	}
	

	return (
	<div className="flex flex-col md:flex-row gap-3">
		<div className="bg-white border-lg p-5 basis-full md:basis-2/3">
			<div className="flex flex-row justify-between items-center bg-blue-300 -m-5 mb-5 p-5 rounded-t">
				<h2 className="text-xl">RPC Approval Flow</h2>
			</div>
			<div className="prose max-w-none mb-5">
				<div className="flex flex-row justify-between items-center">

				<p>Submitted RPCs will go through the approval process as defined below.</p>
				<button type="button" onClick={() => setShowHelp(!showHelp)} className="flex flex-row justify-between items-center gap-1"><MdOutlineHelp /> Help</button>
				</div>
				{!!showHelp && (<div className="bg-gray-50 border shadow p-5">
				<h2 className="mt-3">Using the Approval Flow Editor</h2>
				<p>Individuals who are required to review, verify, or otherwise sign off on a submitted RPC can be added by searching for their first or last name using the form entitled <em>"Add Employee to RPC Approval Flow"</em>.</p>
				<p>Individuals can be removed from the approval queue by clicking the red <MdOutlineDeleteForever className="inline text-lg" /> icon next to their name.</p>
				<p>The individuals involved in the approval process can be reordered by clicking the <MdOutlineDragHandle className="inline text-lg"/> icon and draggig it into appropriate place in the approval process.</p>
				<p>Please note: the first and last items (Department Head and Civil Service Commission) are not able to be moved as these steps are required to begin and finalize the RPC process.</p>
				<p>Click the "Save Changes" after you have modified the RPC approval queue.</p>
				</div>)}
			</div>
			<div className="border shadow">
				<div className="flex flex-row items-center p-5 gap-5 border bg-gray-100">
					<div>
						<MdLock className="text-2xl"/>
					</div>
					<h2 className="text-xl">Department Head</h2>
				</div>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd = {({over, active}) => {
						setActiveId(null)
						const oldIndex = items.findIndex(x => x.id === active.id)
						const newIndex = items.findIndex(x => x.id === over.id)

						if(oldIndex !== newIndex) {
							setItems(() => arrayMove(items, oldIndex, newIndex))

						}
					}}
					onDragCancel={() => setActiveId(null)}
				>
					<SortableContext
						items={items}
						strategy={verticalListSortingStrategy}
					>

						{items && items.map((item) => <SortableItem key={item.id} id={item.id} {...item} doRemoveFromList={removeFromList} />)}
					</SortableContext>
					
				</DndContext>
				<div className="flex flex-row items-center p-5 gap-5 border bg-gray-100">
					<div>
						<MdLock className="text-2xl"/>
					</div>
					<h2 className="text-xl">Civil Service Commission</h2>
				</div>
			</div>
			<div className="text-right mt-3">
			<button type="button" className="btn primary" onClick={saveQueue}>Save Changes</button>
			</div>
		</div>

		<div className="bg-white border-lg p-5 basis-full md:basis-1/3">
			<div className="flex flex-row justify-between items-center bg-blue-300 -m-5 mb-5 p-5 rounded-t">
				<h2 className="text-xl">Add Employee to RPC Approval Flow</h2>
			</div>
			<ApprovalFlowSearch onAddToList={addToList} items={items} />
		</div>

	</div>
	)

	

}



export const Item = forwardRef(({id, ...props}, ref) => {
	return (
		<div { ...props } ref={ref}>{id}</div>
	)
})