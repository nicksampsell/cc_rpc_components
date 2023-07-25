import React, {useState, forwardRef, useEffect, useMemo} from 'react'
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query'
import axios from 'axios'
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {SortableItem} from './SortableItem'
import {RxDragHandleDots1} from 'react-icons/rx'
import {MdOutlineDragHandle} from 'react-icons/md'
import {RiAddCircleFill} from 'react-icons/ri'
import debounce from 'lodash.debounce';

export const useSearchEmployees = (term) => 
useQuery({
	queryKey: ['getSearchEmployee', term],
	queryFn: async () => {
		const { data } = await axios.get('/Api/ApprovalFlowApi/SearchEmployees/' + term,
		{
			withCredentials: true,
			headers: {
				'X-Requested-With': 'XMLHttpRequest'
			}
		})
		return data
	},
	enabled: !!term
})

export function ApprovalFlowSearch(props) {

	const [searchTerm, setSearchTerm] = useState('')
	const { status, data: resultsList, error, isFetching, isLoading } = useSearchEmployees(searchTerm)

	const changeHandler = (e) => {
		setSearchTerm(e.target.value) 
	}

	const debouncedChangeHandler = useMemo(
		() => debounce(changeHandler, 300)
	, []);


	return (
		<>
			<form>
				<div className="flex flex-col gap-3 mb-5">
					<label className="form-label">Search Employees</label>
					<input type="text" value={searchTerm} className="form-control" onChange={e => setSearchTerm(e.target.value)} placeholder="First or Last Name"/>
				</div>
				<div className="text-right">
					<button type="button" className="btn primary">Search</button>
				</div>
			</form>

			<div>
			<div>
				{isLoading && ( <p>Loading...</p>) }
			</div>
			{(resultsList && typeof(resultsList) != undefined) && (
				<ul className="border divide-y mt-5">
					{resultsList.map(item => (
						<li key={item.id} className="flex flex-row justify-between items-center p-3">
							<div className="flex flex-col gap-3">
								<strong>{item?.fullName}</strong>
								<span>{item?.position?.title}</span>
							</div>
							<button type="button" className="btn text-xl"><RiAddCircleFill /></button>
						</li>
					))}
				</ul>
			)}
			</div>


		</>
	)
}