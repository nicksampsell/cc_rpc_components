import React, {useState, forwardRef, useEffect} from 'react'
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query'
import axios from 'axios'
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {SortableItem} from './SortableItem'
import {RxDragHandleDots1} from 'react-icons/rx'
import {MdOutlineDragHandle} from 'react-icons/md'
import {ApprovalFlowSearch} from './ApprovalFlowSearch'

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



export function ApprovalFlowEditor()
{
	const getIndex = (id) => items.indexOf(id)

	const [activeId, setActiveId] = useState(null)
	const [items, setItems] = useState([])
	const activeIndex = activeId ? getIndex(activeId) : -1;
	const { status, data: approvalFlowItems, error, isFetching, isLoading } = useGetApprovalFlow()

	
	const sensors = useSensors(
		useSensor(PointerSensor),
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

	

	return (
	<div className="flex flex-col md:flex-row gap-3">
		<div className="bg-white border-lg p-5 basis-full md:basis-2/3">
			<div className="flex flex-row justify-between items-center bg-blue-300 -m-5 mb-5 p-5 rounded-t">
				<h2 className="text-xl">RPC Approval Flow</h2>
			</div>
			<div className="border shadow">

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

					{items && items.map((item) => <SortableItem key={item.id} id={item.id} {...item} />)}
				</SortableContext>
				
			</DndContext>
			</div>
		</div>

		<div className="bg-white border-lg p-5 basis-full md:basis-1/3">
			<div className="flex flex-row justify-between items-center bg-blue-300 -m-5 mb-5 p-5 rounded-t">
				<h2 className="text-xl">Add Employee to RPC Approval Flow</h2>
			</div>
			<ApprovalFlowSearch />
		</div>

	</div>
	)

	

}



export const Item = forwardRef(({id, ...props}, ref) => {
	return (
		<div { ...props } ref={ref}>{id}</div>
	)
})