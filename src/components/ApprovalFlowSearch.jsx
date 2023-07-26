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

	const [searchTerm, setSearchTerm] = useState('sa')
	const [resultsList, setResultsList] = useState([])
	const { status, data: searchResults, error, isFetching, isLoading } = useSearchEmployees(searchTerm)

	const changeHandler = (e) => {
		setSearchTerm(e.target.value) 
	}

	useEffect(() => {
		if(typeof(searchResults) !== "undefined")
		{
			setResultsList(searchResults)
		}
	}, [searchResults])

	const debouncedChangeHandler = useMemo(
		() => debounce(changeHandler, 300)
	, []);

	const usedIds = props.items.map(x => (x.id));


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

			<div className="border mt-5 rounded">
			
				{isLoading && ( <div className="p-3"><p>Loading...</p></div>) }
			{(resultsList && typeof(resultsList) != undefined) && (
				<ul className="divide-y">
					<li className="p-3 font-semibold text-xl bg-gray-200">Search Results</li>
					{resultsList.filter(x => !usedIds.includes(x.id)).map(item => (
						<li key={item.id} className="flex flex-row justify-between items-center p-3">
							<div className="flex flex-col gap-3">
								<strong>{item?.fullName}</strong>
								<span>{item?.position?.title}</span>
							</div>
							<button type="button" className="btn text-xl text-green-500 hover:text-green-700 active:text-green-900 active:outline-0 active:ring-0 text-right" onClick={() => {
								props.onAddToList({
									id: item.id,
									user: {
										firstName: item.firstName,
										lastName: item.lastName,
										fullName: item.fullName
									},
									userId: item.id,
									title: item?.position?.title,
									ordinal: null,
									isActive: true,
									isStatic: false
								})

							}}><RiAddCircleFill /></button>
						</li>
					))}
				</ul>
			)}
			</div>


		</>
	)
}